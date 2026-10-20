use std::{cell::Cell, rc::Rc};
use wasm_bindgen::{prelude::*, Clamped, JsCast};
use web_sys::{CanvasRenderingContext2d, Document, Element, HtmlCanvasElement, ImageData};

// ✏️ Add your stuff here: (name, description, url)
const PROJECTS: &[(&str, &str, &str)] = &[
    // ("my-crate", "What it does.", "https://github.com/MrUranium1/my-crate"),
];
const OPEN_SOURCE: &[(&str, &str, &str)] = &[];
const ASSETS: &[(&str, &str, &str)] = &[];

const W: u32 = 640;
const H: u32 = 360;

fn el(doc: &Document, tag: &str, class: &str, text: &str) -> Result<Element, JsValue> {
    let e = doc.create_element(tag)?;
    if !class.is_empty() {
        e.set_class_name(class);
    }
    if !text.is_empty() {
        e.set_text_content(Some(text));
    }
    Ok(e)
}

fn mandelbrot(zoom: f64) -> Vec<u8> {
    let (cx, cy) = (-0.743_643_887_037_151, 0.131_825_904_205_330);
    let scale = 3.0 / zoom;
    let max = (80.0 + zoom.log2().max(0.0) * 30.0) as u32;
    let mut buf = vec![0u8; (W * H * 4) as usize];
    for py in 0..H {
        for px in 0..W {
            let x0 = cx + (px as f64 / W as f64 - 0.5) * scale * (W as f64 / H as f64);
            let y0 = cy + (py as f64 / H as f64 - 0.5) * scale;
            let (mut x, mut y, mut i) = (0.0f64, 0.0f64, 0u32);
            while x * x + y * y <= 4.0 && i < max {
                let t = x * x - y * y + x0;
                y = 2.0 * x * y + y0;
                x = t;
                i += 1;
            }
            let o = ((py * W + px) * 4) as usize;
            let c = if i == max {
                [14, 9, 7, 255]
            } else {
                let s = (i as f64 * 0.13).sin() * 0.5 + 0.5;
                [(40.0 + 215.0 * s) as u8, (10.0 + 70.0 * s * s) as u8, (6.0 + 24.0 * s) as u8, 255]
            };
            buf[o..o + 4].copy_from_slice(&c);
        }
    }
    buf
}

fn draw(ctx: &CanvasRenderingContext2d, zoom: f64) -> Result<(), JsValue> {
    let data = mandelbrot(zoom);
    let img = ImageData::new_with_u8_clamped_array_and_sh(Clamped(&data), W, H)?;
    ctx.put_image_data(&img, 0.0, 0.0)
}

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    let doc = web_sys::window().unwrap().document().unwrap();
    let app = doc.get_element_by_id("app").unwrap();
    app.set_text_content(None);

    app.append_child(&el(&doc, "h1", "", "Rust.")?)?;
    app.append_child(&el(&doc, "p", "tag", "This page is written in Rust and compiled to WebAssembly. Click the fractal to zoom in.")?)?;

    let canvas: HtmlCanvasElement = doc.create_element("canvas")?.dyn_into()?;
    canvas.set_width(W);
    canvas.set_height(H);
    let ctx: CanvasRenderingContext2d = canvas.get_context("2d")?.unwrap().dyn_into()?;
    draw(&ctx, 1.0)?;

    let zoom = Rc::new(Cell::new(1.0f64));
    let (ctx2, zoom2) = (ctx.clone(), zoom.clone());
    let on_click = Closure::wrap(Box::new(move || {
        let mut z = zoom2.get() * 2.5;
        if z > 1e7 {
            z = 1.0;
        }
        zoom2.set(z);
        let _ = draw(&ctx2, z);
    }) as Box<dyn FnMut()>);
    canvas.add_event_listener_with_callback("click", on_click.as_ref().unchecked_ref())?;
    on_click.forget();
    app.append_child(&canvas)?;

    let sections: [(&str, &[(&str, &str, &str)]); 3] =
        [("projects", PROJECTS), ("open_source", OPEN_SOURCE), ("assets", ASSETS)];
    for (title, items) in sections {
        let sec = el(&doc, "section", "sec", "")?;
        sec.append_child(&el(&doc, "h2", "", title)?)?;
        if items.is_empty() {
            sec.append_child(&el(&doc, "p", "empty", "// nothing here yet")?)?;
        }
        for (name, desc, url) in items.iter() {
            let a = el(&doc, "a", "item", "")?;
            a.set_attribute("href", url)?;
            a.set_attribute("target", "_blank")?;
            a.append_child(&el(&doc, "b", "", name)?)?;
            a.append_child(&el(&doc, "p", "", desc)?)?;
            sec.append_child(&a)?;
        }
        app.append_child(&sec)?;
    }
    Ok(())
}
