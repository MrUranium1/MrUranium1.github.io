# mehir.is-a.dev

Two modes, one site: **UI** (visual portfolio) and **</> CODE** (real source explorer).

## Run / build / deploy
    python3 build.py              # bundles whitelisted files -> data/sources.json
    python3 -m http.server 8000   # open http://localhost:8000
Deploy: publish the folder to GitHub Pages (CNAME `mehir.is-a.dev`). Re-run `build.py` before each deploy. Routing is hash-based (`#/rust`, `#/code/app.js`), so refresh and back/forward work on static hosting.

## What each language really does
- **HTML/CSS/JS** — the whole site; runs in the browser.
- **Python** — `build.py`; runs at build time only.
- **Rust, C, Ruby, Java** — nothing yet. No WebAssembly or runtime was added without a purpose.

## Source whitelist
Edit `WHITELIST` in `build.py`. Only listed files are bundled; nothing else is reachable from Code Mode.

## Content
`data/content.json`, built only from my public GitHub profile. PRs are not itemized yet.
