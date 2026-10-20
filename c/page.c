// The whole page is built by this C program (compiled to WebAssembly, no libc).
// page() returns the HTML; frame() returns an RGBA plasma framebuffer.
#define W 320
#define H 180
#define EXPORT(n) __attribute__((export_name(n)))

typedef struct { const char *name, *desc, *url; } Item;

// ✏️ Add your stuff here: { name, description, url }. Keep the {0,0,0} at the end.
static const Item PROJECTS[]    = { /* {"my-tool", "What it does.", "https://github.com/MrUranium1/my-tool"}, */ {0,0,0} };
static const Item OPEN_SOURCE[] = { {0,0,0} };
static const Item ASSETS[]      = { {0,0,0} };

static char out[16384];
static int  n;
static void put(const char *s) { while (*s && n < (int)sizeof out - 1) out[n++] = *s++; }

static void section(const char *title, const Item *it) {
    put("<section class=\"sec\"><h2>"); put(title); put("</h2>");
    if (!it->name) put("<p class=\"empty\">/* nothing here yet */</p>");
    for (; it->name; it++) {
        put("<a class=\"item\" target=\"_blank\" href=\""); put(it->url); put("\"><b>");
        put(it->name); put("</b><p>"); put(it->desc); put("</p></a>");
    }
    put("</section>");
}

EXPORT("page") const char *page(void) {
    n = 0;
    put("<h1>C.</h1><p class=\"tag\">This page is built by a C program compiled to WebAssembly. "
        "The plasma below is rendered by C, pixel by pixel.</p>"
        "<canvas id=\"fb\" width=\"320\" height=\"180\"></canvas>");
    section("projects", PROJECTS);
    section("open_source", OPEN_SOURCE);
    section("assets", ASSETS);
    out[n] = 0;
    return out;
}

// parabolic sine approximation, so we need no libm
static float fsin(float x) {
    const float TAU = 6.2831853f, PI = 3.14159265f;
    x -= TAU * (float)(int)(x / TAU);
    if (x > PI) x -= TAU; else if (x < -PI) x += TAU;
    float y = 1.27323954f * x - 0.405284735f * x * (x < 0 ? -x : x);
    return 0.225f * (y * (y < 0 ? -y : y) - y) + y;
}

static unsigned char fb[W * H * 4];

EXPORT("frame") unsigned char *frame(float t) {
    for (int y = 0; y < H; y++)
        for (int x = 0; x < W; x++) {
            float v = fsin(x * 0.045f + t) + fsin(y * 0.06f - t * 1.3f) + fsin((x + y) * 0.03f + t * 0.7f);
            int g = (int)((v + 3.0f) * (255.0f / 6.0f));
            unsigned char *p = &fb[(y * W + x) * 4];
            p[0] = g / 9; p[1] = g; p[2] = g / 5; p[3] = 255;
        }
    return fb;
}
