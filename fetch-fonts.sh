#!/bin/sh
# Run once (needs internet): downloads the handwriting fonts so the site never calls an external service.
cd "$(dirname "$0")"
B=https://cdn.jsdelivr.net/fontsource/fonts
curl -fL $B/kalam@latest/latin-400-normal.woff2 -o kalam-400.woff2
curl -fL $B/kalam@latest/latin-700-normal.woff2 -o kalam-700.woff2
curl -fL $B/caveat@latest/latin-400-normal.woff2 -o caveat-400.woff2
curl -fL $B/caveat@latest/latin-700-normal.woff2 -o caveat-700.woff2
curl -fL $B/patrick-hand@latest/latin-400-normal.woff2 -o patrick-400.woff2
