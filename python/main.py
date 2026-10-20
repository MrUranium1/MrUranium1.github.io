from pyscript import document
from pyodide.ffi import create_proxy

# ✏️ Add your stuff here: (name, description, url)
PROJECTS = [
    # ("my-script", "What it does.", "https://github.com/MrUranium1/my-script"),
]
OPEN_SOURCE = []
ASSETS = []


def el(tag, cls="", text=""):
    e = document.createElement(tag)
    if cls:
        e.className = cls
    if text:
        e.textContent = text
    return e


app = document.getElementById("app")
app.textContent = ""

app.appendChild(el("h1", "", ">>> Python"))
app.appendChild(el("p", "tag", "This page is written in Python, running in your browser via PyScript. Try the REPL:"))

# --- tiny REPL ---
repl = el("div", "repl")
log = el("div", "log")
row = el("div", "row")
row.appendChild(el("span", "ps", ">>>"))
box = document.createElement("input")
box.setAttribute("placeholder", "sum(i*i for i in range(10))")
box.setAttribute("spellcheck", "false")
row.appendChild(box)
repl.appendChild(log)
repl.appendChild(row)
app.appendChild(repl)


def on_key(event):
    if event.key != "Enter":
        return
    code = box.value.strip()
    if not code:
        return
    try:
        out = repr(eval(code))
        cls = "out"
    except Exception as ex:
        out = f"{type(ex).__name__}: {ex}"
        cls = "out err"
    log.appendChild(el("div", "in", ">>> " + code))
    log.appendChild(el("div", cls, out))
    box.value = ""
    log.scrollTop = log.scrollHeight


box.addEventListener("keydown", create_proxy(on_key))

# --- sections ---
for title, items in [("projects", PROJECTS), ("open_source", OPEN_SOURCE), ("assets", ASSETS)]:
    sec = el("section", "sec")
    sec.appendChild(el("h2", "", title))
    if not items:
        sec.appendChild(el("p", "empty", "# nothing here yet"))
    for name, desc, url in items:
        a = el("a", "item")
        a.setAttribute("href", url)
        a.setAttribute("target", "_blank")
        a.appendChild(el("b", "", name))
        a.appendChild(el("p", "", desc))
        sec.appendChild(a)
    app.appendChild(sec)
