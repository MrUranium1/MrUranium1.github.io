# needs: clang + lld   (sudo apt install clang lld)
../../assets/tokenizer.wasm: tokenizer.c
	clang --target=wasm32 -nostdlib -fno-builtin -O2 -Wl,--no-entry -o $@ $<
