// Runs in the browser. Hash routing: #/  #/<lang>  #/code/<file path>
const LANGS = ["html", "rust", "python", "java", "c", "ruby"];
const $ = (id) => document.getElementById(id);
const main = $("main");
let content = null, sources = null, lastLang = null, lastFile = null;

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const el = (t, cls, html) => { const e = document.createElement(t); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const ext = (p) => p.split(".").pop();

function highlight(text, p) {
  const e = ext(p);
  const com = { py: "#.*", js: "\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\/", css: "\\/\\*[\\s\\S]*?\\*\\/", html: "<!--[\\s\\S]*?-->" }[e];
  const kw = { py: "def|import|from|return|if|else|for|in|with|as|class|not|and|or|try|except|True|False|None",
    js: "const|let|var|function|return|if|else|for|of|in|new|async|await|null|true|false|throw|try|catch" }[e];
  if (!com && !kw) return esc(text);
  const re = new RegExp(`(${com || "(?!)"})|("(?:\\\\.|[^"\\\\\\n])*"|'(?:\\\\.|[^'\\\\\\n])*')${kw ? `|\\b(${kw})\\b` : ""}`, "g");
  let out = "", last = 0, m;
  while ((m = re.exec(text))) {
    out += esc(text.slice(last, m.index));
    const cls = m[1] ? "t-c" : m[2] ? "t-s" : "t-k";
    out += `<span class="${cls}">${esc(m[0])}</span>`;
    last = re.lastIndex;
  }
  return out + esc(text.slice(last));
}

function parse() {
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
  if (h.startsWith("code")) return { mode: "code", file: h.slice(5) || null };
  return { mode: "ui", lang: LANGS.includes(h) ? h : null, bad: h && !LANGS.includes(h) };
}

function item(name, url, desc, tag) {
  return `<div class="item"><b><a href="${esc(url)}" rel="noopener">${esc(name)}</a> ${tag ? `<span class="tag">· ${esc(tag)}</span>` : ""}</b><span class="muted">${esc(desc)}</span></div>`;
}

function renderHome() {
  const c = content;
  main.innerHTML = `<h1>${esc(c.name)}</h1><p>${esc(c.tagline)}</p><p class="muted">${esc(c.bio)}</p>
    <div class="links">${c.links.map((l) => `<a href="${esc(l.url)}" rel="noopener">${esc(l.label)} ↗</a>`).join("")}</div>
    <h2>Selected work</h2>${c.work.map((w) => item(w.name, w.url, w.desc, w.lang)).join("")}
    <h2>Open-source contributions</h2>${c.contributions.map((w) => item(w.name, w.url, w.note)).join("")}
    <h2>Explore by language</h2><p class="muted">Pick a language in the bar above.</p>`;
}

function renderLang(k) {
  const l = content.langs[k];
  const proj = l.projects.length ? l.projects.map((p) => item(p.name, p.url, p.desc)).join("")
    : `<div class="empty">No verified ${esc(l.label)} projects yet.</div>`;
  main.innerHTML = `<h1>${esc(l.label)}</h1><p class="tag">${esc(l.status)}</p>${l.blurb ? `<p class="muted">${esc(l.blurb)}</p>` : ""}<h2>Projects</h2>${proj}`;
}

function renderCode(file) {
  const files = Object.keys(sources);
  const ctx = content.codeContext[lastLang];
  file = file && sources[file] != null ? file : (ctx && sources[ctx] ? ctx : lastFile || files[0]);
  lastFile = file;
  const wrap = el("div", "code");
  const tree = el("nav", "tree"); tree.setAttribute("aria-label", "Source files");
  files.forEach((f) => {
    const b = el("button", "", esc(f)); b.type = "button";
    if (f === file) b.setAttribute("aria-current", "true");
    b.onclick = () => (location.hash = "#/code/" + f);
    tree.append(b);
  });
  const src = el("section", "src");
  src.innerHTML = `<p class="path">${esc(file)}</p><pre><code>${highlight(sources[file], file)}</code></pre>`;
  wrap.append(tree, src);
  main.replaceChildren(wrap);
}

async function route() {
  const r = parse();
  $("m-ui").setAttribute("aria-pressed", r.mode === "ui");
  $("m-code").setAttribute("aria-pressed", r.mode === "code");
  main.classList.toggle("wide", r.mode === "code");
  if (r.mode === "ui") {
    if (r.lang) lastLang = r.lang; else if (!r.bad) lastLang = null;
    document.querySelectorAll("#langs a").forEach((a) => a.dataset.k === lastLang ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
    if (r.bad) main.innerHTML = `<h1>Not found</h1><p class="muted">No such page. <a href="#/">Go home</a>.</p>`;
    else r.lang ? renderLang(r.lang) : renderHome();
  } else {
    document.querySelectorAll("#langs a").forEach((a) => a.removeAttribute("aria-current"));
    renderCode(r.file);
  }
  document.title = r.mode === "code" ? "Code · Mehir" : (lastLang ? content.langs[lastLang].label + " · Mehir" : "Mehir");
}

async function init() {
  try {
    const [c, s] = await Promise.all([fetch("data/content.json").then((r) => r.json()), fetch("data/sources.json").then((r) => r.json())]);
    content = c; sources = s;
  } catch (e) {
    main.innerHTML = `<h1>Couldn't load data</h1><p class="muted">Run <code>python3 build.py</code> and serve over HTTP. (${esc(String(e))})</p>`;
    return;
  }
  $("langs").append(...LANGS.map((k) => { const a = el("a", "", content.langs[k].label); a.href = "#/" + k; a.dataset.k = k; return a; }));
  // Mode switch preserves context: language <-> source file
  $("m-ui").onclick = () => (location.hash = "#/" + (lastLang || ""));
  $("m-code").onclick = () => (location.hash = "#/code/" + (content.codeContext[lastLang] || lastFile || ""));
  window.addEventListener("hashchange", () => { route(); main.focus({ preventScroll: true }); window.scrollTo(0, 0); });
  route();
}
init();
