package dev.mehir;

import org.teavm.jso.browser.Window;
import org.teavm.jso.dom.html.HTMLDocument;
import org.teavm.jso.dom.html.HTMLElement;

public class Main {
    // ✏️ Add your stuff here: { name, description, url }
    static final String[][] PROJECTS = {
        // { "my-app", "What it does.", "https://github.com/MrUranium1/my-app" },
    };
    static final String[][] OPEN_SOURCE = {};
    static final String[][] ASSETS = {};

    static HTMLDocument doc;

    static HTMLElement el(String tag, String cls, String text) {
        HTMLElement e = doc.createElement(tag);
        if (!cls.isEmpty()) e.setClassName(cls);
        if (!text.isEmpty()) e.setInnerText(text);
        return e;
    }

    static void section(HTMLElement app, String title, String[][] items) {
        HTMLElement sec = el("section", "sec", "");
        sec.appendChild(el("h2", "", title));
        if (items.length == 0) sec.appendChild(el("p", "empty", "// nothing here yet"));
        for (String[] it : items) {
            HTMLElement a = el("a", "item", "");
            a.setAttribute("href", it[2]);
            a.setAttribute("target", "_blank");
            a.appendChild(el("b", "", it[0]));
            a.appendChild(el("p", "", it[1]));
            sec.appendChild(a);
        }
        app.appendChild(sec);
    }

    public static void main(String[] args) {
        doc = Window.current().getDocument();
        HTMLElement app = doc.getElementById("app");
        app.setInnerText("");

        app.appendChild(el("h1", "", "Java."));
        app.appendChild(el("p", "tag", "This page is written in Java and compiled to JavaScript with TeaVM."));

        HTMLElement wrap = el("div", "brew", "");
        HTMLElement steam = el("div", "steam", "");
        HTMLElement cup = el("button", "cup", "☕ Brew a cup");
        HTMLElement count = el("p", "tag", "Cups brewed: 0");
        int[] n = {0};
        cup.listenClick(e -> {
            n[0]++;
            count.setInnerText("Cups brewed: " + n[0]);
        });
        wrap.appendChild(steam);
        wrap.appendChild(cup);
        app.appendChild(wrap);
        app.appendChild(count);

        section(app, "Projects", PROJECTS);
        section(app, "OpenSource", OPEN_SOURCE);
        section(app, "Assets", ASSETS);
    }
}
