# mehir.is-a.dev

One portfolio, two views. **UI mode** shows what I build. **Code mode** shows how the site is built.
Plain HTML, CSS and JavaScript. No framework, no runtime dependencies, hosted as static files.

## Run locally
    python3 tools/build.py        # validates content, writes manifest.json
    python3 -m http.server 8000   # open http://localhost:8000

Routes use the URL hash, so they work on GitHub Pages and survive refresh and back/forward:
`#/` home, `#/ui/<html|rust|python|java|c|ruby>`, `#/code/<path>`.

## Edit content
`data/content.json` holds projects, contributions and the per-language descriptions. Add only things that are real.
Set `"langs": ["rust"]` on a project to list it in that language's page. Then re-run `tools/build.py`.

## Where each language is actually used
| Language | Role | Where it runs | Status |
|---|---|---|---|
| HTML/CSS/JS | the site itself | browser | working |
| C | syntax tokenizer, compiled to WebAssembly | browser | working, tested |
| Python | `tools/build.py`, manifest and whitelist | build time | working, tested |
| Ruby | `tools/validate_content.rb`, content checks | build time | working, tested |
| Rust | WebAssembly prototype in `experiments/rust` | not deployed | not built or tested |
| Java | TeaVM prototype in `experiments/java` | not deployed | not built or tested |

## Rebuild the C module
    sudo apt install clang lld
    make -C src/c        # writes assets/tokenizer.wasm

## Code mode safety
Code mode only reads files listed in `tools/whitelist.txt`. `build.py` rejects `.env`, keys, `.git`,
anything named like a secret/token/password, binaries, and files over 1 MB. GitHub Pages serves every
file in the repo publicly anyway, so never commit secrets.

## Deploy
Serve this folder with GitHub Pages (branch deploy, root). Nothing is pushed or published automatically.
Commit the generated `manifest.json` and `assets/tokenizer.wasm`.
