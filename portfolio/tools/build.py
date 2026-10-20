#!/usr/bin/env python3
"""Build-time step: validate content (Ruby), check the whitelist, write manifest.json.

Run from anywhere:  python3 tools/build.py
Only files listed in tools/whitelist.txt can ever appear in Code Mode.
"""
import json, re, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LANG = {".c": "c", ".rs": "rust", ".py": "python", ".rb": "ruby", ".java": "java", ".js": "javascript",
        ".html": "html", ".css": "css", ".json": "json", ".md": "markdown", ".toml": "toml",
        ".xml": "xml", ".txt": "text", "Makefile": "make"}
DENY = re.compile(r"(^|/)(\.env.*|\.git|node_modules|id_rsa.*|.*\.(pem|key|p12|pfx|wasm|zip))($|/)|(^|[/._-])(secrets?|tokens?|passwords?|credentials?)([._/-]|$)", re.I)
MAX = 1_000_000
CONTEXTS = {"html", "rust", "python", "java", "c", "ruby"}

def fail(msg):
    print("build: " + msg, file=sys.stderr); sys.exit(1)

if shutil.which("ruby"):
    r = subprocess.run(["ruby", str(ROOT / "tools/validate_content.rb")], capture_output=True, text=True)
    print((r.stdout or r.stderr).strip())
    if r.returncode: fail("content validation failed")
else:
    print("build: ruby not found, skipping content validation", file=sys.stderr)

files = []
for line in (ROOT / "tools/whitelist.txt").read_text().splitlines():
    if not line.strip() or line.startswith("#"): continue
    path, _, ctx = line.partition("\t")
    path, ctx = path.strip(), ctx.strip()
    if ctx not in CONTEXTS: fail(f"{path}: bad context {ctx!r}")
    if DENY.search(path): fail(f"{path}: looks sensitive, refusing to whitelist")
    p = ROOT / path
    if not p.is_file(): fail(f"{path}: not found")
    if ".." in Path(path).parts: fail(f"{path}: path escapes the site")
    size = p.stat().st_size
    if size > MAX: fail(f"{path}: larger than {MAX} bytes")
    files.append({"path": path, "ctx": ctx, "lang": LANG.get(p.suffix) or LANG.get(p.name, "text"), "size": size})

(ROOT / "manifest.json").write_text(json.dumps({"files": files}, indent=1) + "\n")
print(f"manifest.json: {len(files)} files")
