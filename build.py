#!/usr/bin/env python3
"""Build-time step (runs locally/CI, NOT in the browser).
Bundles an explicit whitelist of public files into data/sources.json
so Code Mode can display the real source of this site."""
import json, pathlib, sys

ROOT = pathlib.Path(__file__).parent
WHITELIST = ["index.html", "style.css", "app.js", "build.py", "data/content.json", "README.md"]

def main():
    out, missing = {}, []
    for rel in WHITELIST:
        p = ROOT / rel
        if p.is_file():
            out[rel] = p.read_text(encoding="utf-8")
        else:
            missing.append(rel)
    (ROOT / "data" / "sources.json").write_text(json.dumps(out), encoding="utf-8")
    print(f"bundled {len(out)} files" + (f"; missing: {missing}" if missing else ""))
    return 1 if missing else 0

if __name__ == "__main__":
    sys.exit(main())
