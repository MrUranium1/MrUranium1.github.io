# needs: clang + lld   (sudo apt install clang lld)
page.wasm: page.c
	clang --target=wasm32 -nostdlib -fno-builtin -O2 -Wl,--no-entry -o page.wasm page.c
