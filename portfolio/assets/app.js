(() => {
"use strict";

// ---------- helpers ----------
const $ = (s, r = document) => r.querySelector(s);
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const h = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    k === "class" ? (e.className = v) : e.setAttribute(k, v === true ? "" : v);
  }
  for (const k of kids.flat()) if (k != null) e.append(k.nodeType ? k : document.createTextNode(k));
  return e;
};
const kb = n => (n < 1024 ? n + " B" : (n / 1024).toFixed(1) + " KB");

const S = { content: null, manifest: null, lastUI: "#/", lastCode: {}, texts: new Map(), tok: null, first: true };
const view = $("#view");
const MODE = { rust: 1, c: 1, java: 1, javascript: 1, css: 1, python: 2, ruby: 2, make: 2, toml: 2, html: 3, xml: 3, json: 5 };

// ---------- routing ----------
function route(hash = location.hash) {
  const r = decodeURI(hash.replace(/^#\/?/, ""));
  if (r === "code" || r.startsWith("code/")) return { mode: "code", path: r.slice(5) || null };
  if (r.startsWith("ui/")) return { mode: "ui", id: r.slice(3) };
  return { mode: "ui", id: null };
}
function ctxOf(r) {
  if (r.mode === "ui") return r.id || "html";
  const f = S.manifest.files.find(f => f.path === (r.path || "index.html"));
  return f ? f.ctx : "html";
}
const entryOf = ctx => (S.content.langs.find(l => l.id === ctx) || {}).entry || "index.html";
const codeTarget = ctx => "#/code/" + (S.lastCode[ctx] || entryOf(ctx));
const uiTarget = ctx => (ctxOf(route(S.lastUI)) === ctx ? S.lastUI : "#/ui/" + ctx);

function updateChrome(r) {
  const ctx = ctxOf(r);
  document.body.dataset.lang = ctx;
  if (r.mode === "ui") S.lastUI = location.hash || "#/";
  else S.lastCode[ctx] = r.path || "index.html";
  const ui = $("#sw-ui"), code = $("#sw-code");
  ui.href = r.mode === "ui" ? S.lastUI : uiTarget(ctx);
  code.href = r.mode === "code" ? "#/code/" + (r.path || "index.html") : codeTarget(ctx);
  ui.setAttribute("aria-current", String(r.mode === "ui"));
  code.setAttribute("aria-current", String(r.mode === "code"));
  document.querySelectorAll("#langbar a").forEach(a => {
    const on = a.dataset.id === ctx && !(r.mode === "ui" && !r.id);
    on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
    a.href = r.mode === "code" ? "#/code/" + (S.lastCode[a.dataset.id] || entryOf(a.dataset.id)) : "#/ui/" + a.dataset.id;
  });
}

// ---------- UI mode ----------
const empty = text => h("p", { class: "empty" }, text);
function projectRow(p) {
  return h("article", { class: "row" },
    h("div", {},
      h("h3", {}, h("a", { href: p.url, target: "_blank", rel: "noopener" }, p.name)),
      h("p", {}, p.desc),
      p.tags && p.tags.length ? h("div", { class: "tags" }, p.tags.map(t => h("span", {}, t))) : null),
    h("a", { class: "repo", href: p.url, target: "_blank", rel: "noopener", "aria-label": "Repository for " + p.name }, "repo ↗"));
}
const block = (title, ...kids) => h("section", { class: "blk" }, h("h2", {}, title), ...kids);

function renderHome() {
  const { profile, links, projects, contributions, langs } = S.content;
  document.title = "Mehir";
  return [
    h("section", { class: "hero" },
      h("p", { class: "kicker" }, "mehir.is-a.dev"),
      h("h1", {}, profile.tagline),
      h("p", {}, profile.intro),
      h("div", { class: "links" }, links.map(l => h("a", { href: l.url, target: l.url.startsWith("http") ? "_blank" : null, rel: "noopener" }, l.label)))),
    block("Selected work", projects.length ? projects.map(projectRow) : empty("No verified projects yet.")),
    block("Open source", contributions.length ? contributions.map(projectRow) : empty("No verified contributions listed yet.")),
    block("Environments", h("div", { class: "langlist" }, langs.map(l =>
      h("a", { href: "#/ui/" + l.id }, h("span", {}, l.label), h("span", { class: "meta" }, l.status))))),
  ];
}

function renderEnv(id) {
  const L = S.content.langs.find(l => l.id === id);
  if (!L) return [h("p", { class: "empty" }, "Unknown environment."), h("p", {}, h("a", { href: "#/" }, "← home"))];
  document.title = L.label + " · Mehir";
  const mine = list => list.filter(p => (p.langs || []).includes(id));
  const files = S.manifest.files.filter(f => f.ctx === id);
  const proj = mine(S.content.projects), contrib = mine(S.content.contributions);
  return [
    h("section", { class: "hero" },
      h("p", { class: "kicker" }, "environment"),
      h("h1", {}, L.label, h("span", { class: "chip" }, L.status)),
      h("p", {}, L.role)),
    block("Projects", proj.length ? proj.map(projectRow) : empty("No verified " + L.label + " projects yet.")),
    block("Open source", contrib.length ? contrib.map(projectRow) : empty("No verified " + L.label + " contributions yet.")),
    block("Source in this site", files.length
      ? h("div", { class: "files" }, files.map(f => h("a", { href: "#/code/" + f.path }, h("span", {}, f.path), h("span", { class: "meta" }, kb(f.size)))))
      : empty("No " + L.label + " source in this site yet.")),
  ];
}

// ---------- Code mode ----------
async function tokenizer() {
  if (S.tok !== null) return S.tok;
  try {
    const res = await fetch("assets/tokenizer.wasm");
    if (!res.ok) throw new Error(res.status);
    S.tok = (await WebAssembly.instantiate(await res.arrayBuffer())).instance.exports;
  } catch (e) { S.tok = false; }
  return S.tok;
}

function highlight(text, lang, x) {
  const enc = new TextEncoder().encode(text), mode = MODE[lang] || 0;
  let segs = [[text, 0]];
  if (x && mode && enc.length <= x.input_cap()) {
    new Uint8Array(x.memory.buffer, x.input_ptr(), enc.length).set(enc);
    const n = x.tokenize(enc.length, mode), t = new Uint32Array(x.memory.buffer, x.tokens_ptr(), n * 3), d = new TextDecoder();
    segs = []; let pos = 0;
    for (let i = 0; i < n; i++) {
      const s = t[i * 3], l = t[i * 3 + 1], c = t[i * 3 + 2];
      if (s > pos) segs.push([d.decode(enc.subarray(pos, s)), 0]);
      segs.push([d.decode(enc.subarray(s, s + l)), c]); pos = s + l;
    }
    if (pos < enc.length) segs.push([d.decode(enc.subarray(pos)), 0]);
  }
  const lines = [""];
  for (const [s, c] of segs) s.split("\n").forEach((p, i) => {
    if (i) lines.push("");
    if (p) lines[lines.length - 1] += c ? `<span class="t${c}">${esc(p)}</span>` : esc(p);
  });
  if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

function buildTree(files, cur, ctx) {
  const root = {};
  for (const f of files) { let n = root; const parts = f.path.split("/"); parts.slice(0, -1).forEach(d => (n = n[d] = n[d] || {})); n[parts.at(-1)] = f; }
  const walk = (node, parent) => {
    const keys = Object.keys(node).sort((a, b) => (!!node[a].path - !!node[b].path) || a.localeCompare(b));
    for (const k of keys) {
      const v = node[k];
      if (v.path) {
        const a = h("a", { href: "#/code/" + v.path, class: v.ctx === ctx ? "ctx" : null }, k);
        if (v.path === cur) a.setAttribute("aria-current", "page");
        parent.append(a);
      } else {
        const d = h("details", { open: true }, h("summary", {}, k));
        walk(v, d); parent.append(d);
      }
    }
  };
  const t = h("nav", { class: "tree", id: "tree", "aria-label": "Source files" });
  walk(root, t);
  return t;
}

async function getText(path) {
  if (S.texts.has(path)) return S.texts.get(path);
  const res = await fetch(path);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const t = await res.text(); S.texts.set(path, t); return t;
}

async function renderCode(r) {
  const files = S.manifest.files, path = r.path || "index.html";
  const file = files.find(f => f.path === path);
  const ctx = file ? file.ctx : "html";
  document.title = path + " · Mehir";
  const out = h("output", { "aria-live": "polite" });
  const input = h("input", { id: "cmd", type: "text", autocomplete: "off", spellcheck: "false", "aria-label": "Command line. Try help" });
  const form = h("form", { class: "cmd" }, h("label", { for: "cmd" }, "$"), input, out);
  const pre = h("pre", { tabindex: "0", "aria-label": "Source of " + path }, h("code", {}, h("span", { class: "l" }, "loading…")));
  const bar = h("div", { class: "ebar" },
    h("span", { class: "path" }, path),
    h("span", { class: "meta" }, file ? file.lang + " · " + kb(file.size) : ""),
    h("button", { id: "files-btn", type: "button", "aria-controls": "tree" }, "files"));
  const wrap = h("div", { class: "code" }, buildTree(files, path, ctx),
    h("section", { class: "editor" }, bar, pre));
  $("#files-btn", bar).addEventListener("click", () => wrap.classList.toggle("open"));
  view.replaceChildren(wrap, form);

  const say = m => { out.textContent = m; };
  form.addEventListener("submit", e => {
    e.preventDefault();
    const [c, ...a] = input.value.replace(/^:/, "").trim().split(/\s+/), arg = a.join(" ");
    input.value = "";
    if (c === "ui") location.hash = $("#sw-ui").getAttribute("href");
    else if (c === "ls") say(files.map(f => f.path).join("  "));
    else if (c === "open") {
      const m = files.filter(f => f.path === arg || f.path.includes(arg));
      m.length === 1 ? (location.hash = "#/code/" + m[0].path) : say(m.length ? "ambiguous: " + m.map(f => f.path).join("  ") : "not in the public whitelist: " + arg);
    } else say("commands: ls · open <file> · ui · (press : to focus here)");
  });

  if (!file) { pre.replaceChildren(h("code", {}, h("span", { class: "l" }, "This file is not in the public whitelist, so it cannot be shown."))); return; }
  if (file.size > 1_000_000) { pre.replaceChildren(h("code", {}, h("span", { class: "l" }, "File too large to display (" + kb(file.size) + ")."))); return; }
  try {
    const [text, x] = await Promise.all([getText(path), tokenizer()]);
    if (location.hash.indexOf(encodeURI(path)) < 0 && location.hash.indexOf(path) < 0) return; // navigated away
    const lines = highlight(text, file.lang, x);
    pre.querySelector("code").innerHTML = lines.map(l => `<span class="l">${l || " "}</span>`).join("");
    if (!x && MODE[file.lang]) bar.append(h("span", { class: "meta" }, "highlighter unavailable"));
    if (r.path == null) history.replaceState(null, "", "#/code/index.html");
  } catch (e) {
    pre.replaceChildren(h("code", {}, h("span", { class: "l" }, "Could not load " + path + " (" + e.message + ").")));
  }
}

// ---------- render loop ----------
async function render() {
  const r = route();
  updateChrome(r);
  view.classList.toggle("wide", r.mode === "code");
  if (r.mode === "code") await renderCode(r);
  else { view.replaceChildren(h("div", { class: "fade" }, r.id ? renderEnv(r.id) : renderHome())); }
  if (!S.first) view.focus({ preventScroll: true });
  if (r.mode === "ui") window.scrollTo(0, 0);
  S.first = false;
}

async function boot() {
  try {
    const [c, m] = await Promise.all([fetch("data/content.json"), fetch("manifest.json")]);
    if (!c.ok || !m.ok) throw new Error("could not load site data");
    S.content = await c.json(); S.manifest = await m.json();
  } catch (e) {
    view.replaceChildren(h("p", { class: "empty" }, "Could not load the site data (" + e.message + "). Try reloading."));
    return;
  }
  const bar = $("#langbar");
  S.content.langs.forEach(l => bar.append(h("a", { href: "#/ui/" + l.id, "data-id": l.id }, l.label.toUpperCase())));
  $("#skip").addEventListener("click", e => { e.preventDefault(); view.focus(); });
  addEventListener("hashchange", render);
  addEventListener("keydown", e => {
    if (e.key === ":" && $("#cmd") && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); $("#cmd").focus(); }
  });
  render();
}
boot();
})();
