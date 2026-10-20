// Syntax tokenizer for Code Mode. Freestanding C (no libc) compiled to WebAssembly.
// JS copies UTF-8 source into input_ptr(), calls tokenize(len, mode), then reads
// (start, length, class) triples from tokens_ptr().
// modes: 0 plain, 1 C-like (// and /* */), 2 hash comments, 3 HTML, 5 JSON
// classes: 1 comment, 2 string, 3 number, 4 keyword, 5 tag / json key
#define EXPORT(n) __attribute__((export_name(n)))
#define CAP  (1 << 20)
#define MAXT 60000

static unsigned char buf[CAP];
static unsigned int  tk[MAXT * 3];
static unsigned int  nt;

static const char *KW1 = " fn let mut pub impl struct enum trait use mod const static if else match for while loop return break continue as in where self Self crate async await move unsafe ref type true false null function var new class extends import export from default try catch throw switch case public private protected void int char float double long short unsigned signed typedef sizeof extern inline package interface final abstract this super do goto bool string static ";
static const char *KW2 = " def class end if elif else elsif unless return import from as require include module do while for in not and or self nil None True False true false begin rescue ensure yield lambda with pass try except finally raise global puts print then case when ";
static const char *KW5 = " true false null ";

static int isid0(int c) { return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_'; }
static int isdig(int c) { return c >= '0' && c <= '9'; }
static int isid(int c)  { return isid0(c) || isdig(c); }

static int has(const char *list, const unsigned char *w, int wl) {
    if (wl > 20) return 0;
    for (const char *p = list; *p; p++) {
        if (*p != ' ') continue;
        int k = 0;
        while (k < wl && p[1 + k] == (char)w[k]) k++;
        if (k == wl && p[1 + wl] == ' ') return 1;
    }
    return 0;
}
static void emit(int s, int l, int c) {
    if (nt < MAXT && l > 0) { tk[nt * 3] = s; tk[nt * 3 + 1] = l; tk[nt * 3 + 2] = c; nt++; }
}

EXPORT("input_ptr")  unsigned char *input_ptr(void)  { return buf; }
EXPORT("tokens_ptr") unsigned int  *tokens_ptr(void) { return tk; }
EXPORT("input_cap")  int            input_cap(void)  { return CAP; }

EXPORT("tokenize") unsigned int tokenize(int n, int mode) {
    int i = 0;
    nt = 0;
    if (mode == 0) return 0;
    const char *kw = mode == 1 ? KW1 : mode == 2 ? KW2 : KW5;
    while (i < n) {
        int c = buf[i], s = i;
        if (mode == 3) {                                   // HTML
            if (c == '<' && i + 3 < n && buf[i+1] == '!' && buf[i+2] == '-' && buf[i+3] == '-') {
                i += 4;
                while (i + 2 < n && !(buf[i] == '-' && buf[i+1] == '-' && buf[i+2] == '>')) i++;
                i += 3; if (i > n) i = n;
                emit(s, i - s, 1); continue;
            }
            if (c == '<' && i + 1 < n && (isid0(buf[i+1]) || buf[i+1] == '/' || buf[i+1] == '!')) {
                i++;
                if (buf[i] == '/' || buf[i] == '!') i++;
                while (i < n && (isid(buf[i]) || buf[i] == '-')) i++;
                emit(s, i - s, 5);
                while (i < n && buf[i] != '>') {
                    if (buf[i] == '"' || buf[i] == '\'') {
                        int q = buf[i], a = i++;
                        while (i < n && buf[i] != q) i++;
                        if (i < n) i++;
                        emit(a, i - a, 2);
                    } else i++;
                }
                continue;
            }
            i++; continue;
        }
        if (mode == 1 && c == '/' && i + 1 < n && buf[i+1] == '/') {
            while (i < n && buf[i] != '\n') i++;
            emit(s, i - s, 1); continue;
        }
        if (mode == 1 && c == '/' && i + 1 < n && buf[i+1] == '*') {
            i += 2;
            while (i + 1 < n && !(buf[i] == '*' && buf[i+1] == '/')) i++;
            i += 2; if (i > n) i = n;
            emit(s, i - s, 1); continue;
        }
        if (mode == 2 && c == '#') {
            while (i < n && buf[i] != '\n') i++;
            emit(s, i - s, 1); continue;
        }
        if (c == '"' || c == '`' || (c == '\'' && mode != 5)) {
            if (mode == 2 && c != '`' && i + 2 < n && buf[i+1] == c && buf[i+2] == c) {   // """ ... """
                i += 3;
                while (i + 2 < n && !(buf[i] == c && buf[i+1] == c && buf[i+2] == c)) i++;
                i += 3; if (i > n) i = n;
                emit(s, i - s, 2); continue;
            }
            if (c == '\'' && mode == 1) {                  // string, char literal, or Rust lifetime
                int j = i + 1;
                while (j < n && j < i + 80 && buf[j] != '\n' && buf[j] != '\'') { if (buf[j] == '\\') j++; j++; }
                if (j < n && buf[j] == '\'') { i = j + 1; emit(s, i - s, 2); } else i++;
                continue;
            }
            int q = c;
            i++;
            while (i < n && buf[i] != q) { if (buf[i] == '\\') i++; i++; }
            i++; if (i > n) i = n;
            int cls = 2;
            if (mode == 5) { int j = i; while (j < n && buf[j] == ' ') j++; if (j < n && buf[j] == ':') cls = 5; }
            emit(s, i - s, cls); continue;
        }
        if (isdig(c) && (i == 0 || !isid(buf[i-1]))) {
            while (i < n && (isid(buf[i]) || buf[i] == '.')) i++;
            emit(s, i - s, 3); continue;
        }
        if (isid0(c)) {
            while (i < n && isid(buf[i])) i++;
            if (has(kw, &buf[s], i - s)) emit(s, i - s, 4);
            continue;
        }
        i++;
    }
    return nt;
}
