require "js"

# ✏️ Add your stuff here: [name, description, url]
PROJECTS = [
  # ["my-gem", "What it does.", "https://github.com/MrUranium1/my-gem"],
]
OPEN_SOURCE = []
ASSETS = []

doc = JS.global[:document]

def el(doc, tag, cls = nil, text = nil)
  e = doc.createElement(tag)
  e[:className] = cls if cls
  e[:textContent] = text if text
  e
end

app = doc.getElementById("app")
app[:textContent] = ""

app.appendChild(el(doc, "h1", nil, "Ruby."))
app.appendChild(el(doc, "p", "tag", "This page is written in Ruby, running in your browser via ruby.wasm. Polish the gem."))

count = el(doc, "p", "tag small", "Polished 0 times")
gem = el(doc, "div", "gem")
polished = 0
gem.addEventListener("click") do |_event|
  polished += 1
  gem[:style][:filter] = "hue-rotate(#{(polished * 28) % 360}deg) saturate(1.25)"
  count[:textContent] = "Polished #{polished} #{polished == 1 ? 'time' : 'times'}"
end
app.appendChild(gem)
app.appendChild(count)

{ "projects" => PROJECTS, "open_source" => OPEN_SOURCE, "assets" => ASSETS }.each do |title, items|
  sec = el(doc, "section", "sec")
  sec.appendChild(el(doc, "h2", nil, title))
  sec.appendChild(el(doc, "p", "empty", "nothing here yet")) if items.empty?
  items.each do |name, desc, url|
    a = el(doc, "a", "item")
    a.setAttribute("href", url)
    a.setAttribute("target", "_blank")
    a.appendChild(el(doc, "b", nil, name))
    a.appendChild(el(doc, "p", nil, desc))
    sec.appendChild(a)
  end
  app.appendChild(sec)
end
