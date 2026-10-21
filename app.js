"use strict";
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const $=id=>document.getElementById(id);
const book=$("book"),root=document.documentElement.style;
const reduce=matchMedia("(prefers-reduced-motion: reduce)");
let data,leaves=[],angles=[],cur=0,busy=false,starts={},lay={};

const rnd=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const fits=n=>n.scrollHeight<=n.clientHeight+1;

function size(){
  const w=Math.max(260,Math.min(540,innerWidth-28,(innerHeight-80)/1.38)),h=Math.round(w*1.38);
  const lh=w<420?27:32,pt=lh*2,ih=Math.floor((h-pt-lh*1.4)/lh)*lh;
  const v={"--w":w+"px","--h":h+"px","--lh":lh+"px","--pt":pt+"px","--ih":ih+"px"};
  for(const k in v)root.setProperty(k,v[k]);
  return w+"x"+h;
}
function blocks(body){
  const out=[];
  String(body||"").split(/\n{2,}/).forEach(b=>{
    b=b.trim();if(!b)return;
    const ls=b.split("\n");
    if(ls.every(l=>/^- /.test(l)))ls.forEach(l=>{const u=el("ul");u.appendChild(el("li",null,l.slice(2)));out.push(u)});
    else if(b.startsWith("# "))out.push(el("h4",null,b.slice(2)));
    else if(b.startsWith("> "))out.push({para:b.slice(2).replace(/\n/g," "),cls:"note"});
    else out.push({para:b.replace(/\n/g," ")});
  });
  return out;
}
function paginate(){
  const m=el("div","leaf-measure"),inner=el("div","inner");m.appendChild(inner);document.body.appendChild(m);
  const pages=[];let cur=null;
  const commit=ci=>{pages.push({ch:ci,nodes:[...inner.childNodes].map(n=>n.cloneNode(true))});inner.replaceChildren()};
  data.chapters.forEach((c,ci)=>{
    inner.replaceChildren();
    const add=n=>{inner.appendChild(n);if(!fits(inner)&&inner.childNodes.length>1){inner.removeChild(n);commit(ci);inner.appendChild(n)}};
    const para=(text,cls)=>{
      let words=text.split(/\s+/);
      while(words.length){
        const p=el("p",cls,words.join(" "));inner.appendChild(p);
        if(fits(inner))break;
        inner.removeChild(p);
        let lo=0,hi=words.length-1;
        while(lo<hi){const mid=(lo+hi+1)>>1;p.textContent=words.slice(0,mid).join(" ");inner.appendChild(p);const f=fits(inner);inner.removeChild(p);if(f)lo=mid;else hi=mid-1}
        if(lo===0){if(inner.childNodes.length){commit(ci);continue}lo=1}
        p.textContent=words.slice(0,lo).join(" ");inner.appendChild(p);commit(ci);words=words.slice(lo);
      }
    };
    const h=el("h2",null,c.title);inner.appendChild(h);
    if(c.blurb)inner.appendChild(el("div","blurb",c.blurb));
    const entries=Array.isArray(c.entries)?c.entries:[];
    if(!entries.length)inner.appendChild(el("p","empty","Nothing written here yet."));
    entries.forEach(e=>{
      add(el("h3",null,e.title||"Untitled"));
      if(e.date)add(el("time",null,e.date));
      if(e.placeholder)add(el("p","stamp","(placeholder: not my writing)"));
      blocks(e.body).forEach(b=>b.para?para(b.para,b.cls):add(b));
    });
    commit(ci);
  });
  m.remove();
  return pages;
}
function build(){
  leaves.forEach(l=>l.remove());leaves=[];starts={};
  const pages=paginate();
  const mk=(front,cls)=>{const l=el("div","leaf"),f=el("div","face front"+(cls?" "+cls:"")),b=el("div","face back");l.append(f,b);front(f);book.appendChild(l);leaves.push(l);return l};
  // cover
  const cv=mk(f=>{f.className="face front cover";f.setAttribute("role","button");f.tabIndex=0;f.setAttribute("aria-label","Open the notebook");
    const lb=el("div","label");lb.append(el("h1",null,data.title),el("p",null,data.subtitle||""));f.appendChild(lb);
    f.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();go(1)}})});
  cv.querySelector(".back").style.background="var(--grain),#6b4a38";
  // contents
  mk(f=>{const i=el("div","inner toc");i.appendChild(el("h2",null,"Contents"));
    const ol=el("ol");data.chapters.forEach((c,ci)=>{const li=el("li"),b=el("button");b.type="button";
      b.dataset.ch=ci;b.append(el("span",null,c.title),el("i"),el("span",null,"·"));li.appendChild(b);ol.appendChild(li)});
    i.append(el("div","blurb"),ol);f.appendChild(i);f.addEventListener("click",e=>{const b=e.target.closest("button[data-ch]");if(b&&!drag.moved)go(starts[b.dataset.ch])})});
  pages.forEach((p,k)=>{const idx=leaves.length;if(!(p.ch in starts))starts[p.ch]=idx;
    mk(f=>{const i=el("div","inner");p.nodes.forEach(n=>i.appendChild(n));f.appendChild(i);f.appendChild(el("div","folio",String(idx)));
      f.style.setProperty("--t",((rnd(idx)-.5)*2.4).toFixed(2)+"deg");f.style.setProperty("--mx",((rnd(idx+9)-.5)*6).toFixed(1)+"px");
      f.style.setProperty("--tint",["#f5ecd8","#f3e9d3","#f6eedc","#f2e8d2"][Math.floor(rnd(idx+3)*4)]);
      f.style.setProperty("--ink",rnd(idx+5)>.7?"#241c2a":"#2e2018");f.style.color="var(--ink)"})});
  document.querySelectorAll(".toc button").forEach(b=>b.lastChild.textContent=starts[b.dataset.ch]);
  angles=leaves.map((_,i)=>i<cur?180:0);
  cur=Math.min(cur,leaves.length-1);angles=leaves.map((_,i)=>i<cur?180:0);
  leaves.forEach((_,i)=>apply(i));state();
}
function apply(i,top){
  const a=angles[i],l=leaves[i];
  l.style.transform="rotateY("+(-a)+"deg)";
  l.style.zIndex=top?1000:(i<cur?i:leaves.length-i);
  const s=Math.sin(a*Math.PI/180);
  l.children[0].style.setProperty("--sh",(s*.9).toFixed(2));
  l.children[1].style.setProperty("--sh",(s*.9).toFixed(2));
  l.children[1].style.setProperty("--sh",((1-Math.abs(s))*0+s*.6).toFixed(2));
}
function state(){
  leaves.forEach((l,i)=>{const on=i===cur||(i===cur-1&&false);l.inert=!on;l.setAttribute("aria-hidden",on?"false":"true");l.style.pointerEvents=on?"auto":"none"});
  const n=leaves.length;
  $("prev").disabled=cur===0;$("next").disabled=cur>=n-1;
  $("toc").disabled=cur===1;
  $("where").textContent=cur===0?"cover":cur===1?"contents":"page "+cur;
  document.querySelector(".corner.r").hidden=cur>=n-1;document.querySelector(".corner.l").hidden=cur===0;
  const ch=cur>=2?data.chapters[Math.max(0,Object.keys(starts).filter(k=>starts[k]<=cur).length-1)]:null;
  const h=cur<2?"":"#"+ch.id;
  if(location.hash!==h&&(h||location.hash))history.replaceState(null,"",location.pathname+(h||""));
  document.title=ch?ch.title+" — Mehir’s notebook":"Mehir’s notebook";
}
function animate(i,to,dur){
  return new Promise(res=>{
    const a0=angles[i];
    if(reduce.matches||dur<=0){angles[i]=to;apply(i);return res()}
    const t0=performance.now();
    const step=t=>{const p=Math.min(1,(t-t0)/dur);angles[i]=a0+(to-a0)*ease(p);apply(i,true);
      if(p<1)requestAnimationFrame(step);else{apply(i);res()}};
    requestAnimationFrame(step);
  });
}
async function turn(dir,dur=700){
  if(dir>0&&cur<leaves.length-1){const i=cur;cur++;state();await animate(i,180,dur);}
  else if(dir<0&&cur>0){cur--;state();await animate(cur,0,dur)}
  leaves.forEach((_,i)=>apply(i));
}
async function go(target,instant){
  if(busy||target==null||target===cur||target<0||target>=leaves.length)return;
  busy=true;
  if(instant){cur=target;angles=leaves.map((_,i)=>i<cur?180:0);leaves.forEach((_,i)=>apply(i));state()}
  else{const d=Math.abs(target-cur)>1?Math.max(120,420/Math.abs(target-cur)*1.6):700;
    while(cur!==target)await turn(target>cur?1:-1,d)}
  busy=false;focusTop();
}
function focusTop(){const t=leaves[cur].querySelector("[tabindex],button");if(t&&document.activeElement===document.body)t.focus({preventScroll:true})}

// dragging
const drag={on:false,moved:false,x:0,i:-1,dir:0};
book.addEventListener("pointerdown",e=>{if(busy||e.target.closest(".corner"))return;drag.on=true;drag.moved=false;drag.x=e.clientX;drag.i=-1;drag.dir=0});
book.addEventListener("pointermove",e=>{
  if(!drag.on)return;const dx=e.clientX-drag.x;
  if(!drag.moved){if(Math.abs(dx)<10)return;drag.moved=true;drag.dir=dx<0?1:-1;
    if(drag.dir>0&&cur<leaves.length-1){drag.i=cur;}else if(drag.dir<0&&cur>0){drag.i=cur-1;}else{drag.on=false;return}
    book.setPointerCapture(e.pointerId);getSelection().removeAllRanges()}
  const p=Math.min(1,Math.abs(dx)/(book.offsetWidth*.9));
  angles[drag.i]=drag.dir>0?180*p:180-180*p;apply(drag.i,true);drag.p=p;
});
const endDrag=async()=>{
  if(!drag.on)return;drag.on=false;
  if(!drag.moved)return;
  setTimeout(()=>drag.moved=false,0);
  const i=drag.i;if(i<0)return;busy=true;
  const done=drag.p>.3;
  if(drag.dir>0){if(done){cur++;state();await animate(i,180,300)}else await animate(i,0,250)}
  else{if(done){cur--;state();await animate(i,0,300)}else await animate(i,180,250)}
  leaves.forEach((_,k)=>apply(k));busy=false;
};
book.addEventListener("pointerup",endDrag);book.addEventListener("pointercancel",endDrag);
book.addEventListener("click",e=>{if(drag.moved)return;if(cur===0&&e.target.closest(".cover"))go(1)});

function route(instant){
  const h=decodeURIComponent(location.hash.slice(1));
  if(!h)return go(0,instant);
  const ci=data.chapters.findIndex(c=>c.id===h);
  go(ci>=0?starts[ci]:1,instant);
}
async function init(){
  for(const s of["r","l"]){const b=el("button","corner "+s);b.type="button";b.setAttribute("aria-label",s==="r"?"Turn to the next page":"Turn to the previous page");
    b.onclick=()=>{if(!busy)go(cur+(s==="r"?1:-1))};book.appendChild(b)}
  $("next").onclick=()=>go(cur+1);$("prev").onclick=()=>go(cur-1);$("toc").onclick=()=>go(1);
  addEventListener("keydown",e=>{if(e.target.closest("input,textarea")||e.altKey||e.ctrlKey||e.metaKey)return;
    if(e.key==="ArrowRight"||e.key==="PageDown")go(cur+1);else if(e.key==="ArrowLeft"||e.key==="PageUp")go(cur-1);
    else if(e.key==="Home")go(1);});
  try{data=await (await fetch("content/notebook.json")).json()}
  catch(e){book.appendChild(el("p","ns","The notebook’s pages could not be loaded."));return}
  if(!Array.isArray(data.chapters))data.chapters=[];
  lay=size();if(document.fonts&&document.fonts.ready)await document.fonts.ready;
  build();route(true);
  addEventListener("hashchange",()=>{if(!busy)route(false)});
  let t;addEventListener("resize",()=>{clearTimeout(t);t=setTimeout(()=>{const k=size();if(k===lay)return;lay=k;
    const keep=cur>=2?cur:cur;build();},250)});
}
init();
