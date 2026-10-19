/* ---------- helpers ---------- */
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const UD=n=>String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]);
const mk=t=>t.replace(/\( ([ًٓ-ْٰٖٗ]) \)/g,'<span class="mk">◌$1</span>');
const foot=(l,r)=>`<div class="pg-foot"><span class="tag">${l}</span><span>${r}</span></div>`;

/* ---------- book page ornaments (vector, theme-aware) ---------- */
const STAR=`<svg class="orn" viewBox="0 0 40 40" aria-hidden="true"><polygon points="${starPts(20,20,18,9,8)}" class="o1"/><polygon points="${starPts(20,20,11,6,8,Math.PI/8)}" class="o2"/><circle cx="20" cy="20" r="3.4" class="o3"/></svg>`;
const FLOUR=(flip)=>`<svg class="flour${flip?" flip":""}" viewBox="0 0 60 40" aria-hidden="true"><path d="M58 20 C44 4 26 4 14 12 M58 20 C44 36 26 36 14 28" class="f1"/><path d="M50 20 C42 12 32 12 26 16 M50 20 C42 28 32 28 26 24" class="f2"/><circle cx="10" cy="20" r="5" class="f3"/><circle cx="10" cy="20" r="2" class="o3"/><path d="M2 20 H5" class="f1"/></svg>`;
const SEP=`<span class="sep" aria-hidden="true">◆</span>`;
const AY=`<svg class="ay" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/></svg>`;
function arLine(t){return t.split(" ").map(w=>w==="*"?STAR:w==="•"?SEP:w.startsWith("۝")?`<span class="ayw">${AY}${w.slice(1).replace(/\{(.+?)\}/g,'<sup class="wm am">$1</sup>')}</span>`:w.replace(/\{(.+?)\}/g,'<sup class="wm">$1</sup>')).join(" ")}

/* ---------- book page renderer: one block type per element of the original page ---------- */
function blockHTML(b){
  const t=b[0];
  if(t==="H")return `<div class="bh fitw"><span class="bhin">${FLOUR(0)}<span class="cart"><span class="tn">تختی نمبر</span><span class="num">${UD(b[1])}</span><span class="tt">${b[2]}</span></span>${FLOUR(1)}</span></div>`;
  if(t==="T")return `<div class="bt">${b[1]}</div>`;
  if(t==="U")return `<div class="bu">${b[1]}</div>`;
  if(t==="F")return `<div class="bf">${b[1]}</div>`;
  if(t==="N")return `<div class="bn">${b[1]}</div>`;
  if(t==="K")return `<div class="bk"><span>${b[1]}</span></div>`;
  if(t==="A")return `<div class="ba fitw"><span>${b[1]}</span></div>`;
  if(t==="A2")return `<div class="ba2">${b[1]}</div>`;
  if(t==="S")return `<div class="bs"><i></i><span>﴿ ${b[1]} ﴾</span><i></i></div>`;
  if(t==="O")return `<div class="bo"><i></i>${STAR}<i></i></div>`;
  if(t==="L")return `<div class="bl fitw">${b.lbl?`<b class="lbl">${b.lbl}</b>`:""}<span class="m">${arLine(TJX(b[1]))}</span></div>`;
  if(t==="C"){const orn=b[2]?FLOUR(0):b[3]?STAR:"",orn2=b[2]?FLOUR(1):b[3]?STAR:"";
    return `<div class="bc">${orn}<div class="circs">${b[1].split(" ").map(c=>`<span class="circ">${c}</span>`).join("")}</div>${orn2}</div>`}
  if(t==="G"){const cols=b[1],cells=b[2].split("|"),sz=b[3]||1,rows=[];
    for(let r=0;r<cells.length;r+=cols)rows.push(cells.slice(r,r+cols));
    const gf=Math.min(76,(560/cols)*0.64)*Math.max(sz,.9);
    return `<div class="bg fitg" style="--gf:${gf.toFixed(1)}px">${rows.map(r=>`<div class="gr" style="grid-template-columns:repeat(${cols},1fr)">${r.map(c=>`<div class="gc">${c==="*"?STAR:c?`<span>${TJX(c)}</span>`:""}</div>`).join("")}</div>`).join("")}</div>`}
  if(t==="M"){const cols=b[1],items=b[2],rows=[];for(let r=0;r<items.length;r+=cols)rows.push(items.slice(r,r+cols));
    return `<div class="bg bm fitg">${rows.map(r=>`<div class="gr" style="grid-template-columns:repeat(${cols},1fr)">${r.map(([l,f])=>`<div class="gc"><span class="ml">${l}</span><span class="mf">${f}</span></div>`).join("")}</div>`).join("")}</div>`}
  if(t==="R"){const cols=b[1],items=b[2],rows=[];for(let r=0;r<items.length;r+=cols)rows.push(items.slice(r,r+cols));
    return `<div class="bg br fitg">${rows.map(r=>`<div class="gr" style="grid-template-columns:repeat(${r.length},1fr)">${r.map(([w,rd])=>`<div class="gc"><span class="rw">${TJX(w)}</span><span class="rr">${rd}</span></div>`).join("")}</div>`).join("")}</div>`}
  if(t==="X"){return `<div class="bx">${b[1].map(([s,d])=>`<div class="xr"><span class="xs">${s==="۝"?AY:s}</span><span class="xd">${d}</span></div>`).join("")}</div>`}
  return "";
}
function attachLabels(bs){const out=[];for(let i=0;i<bs.length;i++){const b=bs[i];if(b[0]==="K"&&bs[i+1]&&bs[i+1][0]==="L"){const n=bs[i+1].slice();n.lbl=b[1];out.push(n);i++}else out.push(b)}return out}
let TJ_ON=true,TJ_PAGE=false;
const TJX=s=>TJ_ON&&TJ_PAGE?tj(s):s;
function bookHTML(P,num){
  TJ_PAGE=P.p>=23;
  const who=P.lessons.map(n=>"Takhti "+n).join(" & ");
  return `<div class="pg bookpg"><div class="bpwrap"><div class="bpsizer"><div class="bp" lang="ar" dir="rtl">
      <div class="bpn">${P.p-2} - ${UD(P.p-2)}</div>
      <div class="bpf"><div class="bpi">${attachLabels(BOOK[P.p]).map(blockHTML).join("")}</div></div>
    </div></div></div>
    <div class="pg-foot"><span class="tag">${who}${P.total>1?` · ${P.j+1} of ${P.total}`:""}</span><span class="fbtns">${TJ_ON&&TJ_PAGE?`<button class="zbtn tjkey" type="button" data-tjkey>Colours</button>`:""}<button class="zbtn" type="button" data-zoom>Zoom</button></span><span>${num}</span></div>
    ${TJ_ON&&TJ_PAGE?`<div class="tjleg" role="dialog" aria-label="Tajweed colours"><b>Tajweed colours</b>${TJ_LEGEND.map(l=>`<div class="tjrow"><tj-${l[0]} class="sw">ن</tj-${l[0]}><span><b>${l[1]}</b> <span class="u">${l[2]}</span><small>${l[3]}</small></span></div>`).join("")}<small class="tjnote">Colours start from Takhti 9, where these rules are taught.</small></div>`:""}</div>`}

/* fit the fixed-size page: shrink lines that are too wide, then shrink everything until it fits the frame */
function fitBook(root){
  root.querySelectorAll(".bp").forEach(bp=>{
    const inner=bp.querySelector(".bpi");
    const widths=()=>{bp.querySelectorAll(".fitw").forEach(l=>{l.style.setProperty("--w","1");const s=l.querySelector(":scope > .m, :scope > span");const lb=l.querySelector(":scope > .lbl");const avail=l.clientWidth-10-(lb?lb.offsetWidth+10:0);if(s&&s.offsetWidth>avail)l.style.setProperty("--w",(avail/s.offsetWidth).toFixed(3))});
      bp.querySelectorAll(".fitg").forEach(g=>{g.style.setProperty("--w","1");let m=1;g.querySelectorAll(".gc").forEach(c=>{const avail=c.clientWidth-8;[...c.children].forEach(s=>{if(s.offsetWidth>avail&&s.offsetWidth)m=Math.min(m,avail/s.offsetWidth)})});if(m<1)g.style.setProperty("--w",m.toFixed(3))})};
    const fits=k=>{bp.style.setProperty("--k",k.toFixed(3));widths();return inner.scrollHeight<=inner.clientHeight+1};
    let lo=0.45,hi=1.45;if(fits(hi)){return}
    for(let n=0;n<9;n++){const mid=(lo+hi)/2;if(fits(mid))lo=mid;else hi=mid}
    fits(lo);
  });
}

/* ---------- other page renderers ---------- */
function dividerHTML(P){const L=LESSONS[P.n-1];
  return `<div class="pg divpg"><div class="dv-inner"><div class="dv-medal">${rosette()}<div class="dv-num">${UD(P.n)}</div></div>
    <div class="dv-ur">تختی نمبر ${UD(P.n)}</div><div class="dv-t">${L.ur}</div><div class="dv-en">Takhti ${P.n} · ${L.en}</div></div></div>`}
function render(i){
  const P=SEQ[i], num=`${i+1} / ${SEQ.length}`;
  if(!P)return "";
  if(P.type==="cover")return coverHTML();
  if(P.type==="divider")return dividerHTML(P);
  if(P.type==="blank")return `<div class="pg divpg"><div class="dv-inner"><div class="dv-ur" style="opacity:.6">${STAR}</div></div></div>`;
  if(P.type==="book")return bookHTML(P,num);
  if(P.type==="quiz")return quizHTML(P,num).replace('class="pg quizpg"',`class="pg quizpg" data-n="${P.n}"`);
  if(P.type==="makharij")return makharijHTML(num);
  if(P.type==="kalima")return kalimaHTML(P,num);
  if(P.type==="howto")return `<div class="pg"><div class="pg-body"><h3 class="pt">How to use this Qaida</h3><div class="howto">
    <div><i>1</i><span>The book opens from the right, like the Quran. Swipe right, press <b>Next ←</b>, tap the left edge, or use the ← arrow key to turn the page.</span></div>
    <div><i>2</i><span>Every takhti starts with an <b>explanation page</b>: the rule, then examples with English and Hinglish under each one.</span></div>
    <div><i>3</i><span>Then come the <b>Qaida's own pages</b> for that takhti, exactly as in the book. Read them out loud. Tap <b>Zoom</b> to see the letters bigger.</span></div>
    <div><i>4</i><span>Feeling confident? Open <b>Settings</b> and turn on <b>Practice mode</b> to hide all English and Hinglish.</span></div>
    <div><i>5</i><span>Use <b>☰ Takhtis</b> to jump to any lesson. On a wide screen the book opens as a two-page spread.</span></div></div>
    <div class="note hi" style="margin-top:16px"><strong>Hinglish mein:</strong> kitaab daayein se khulti hai. Aage jaane ke liye right swipe karein ya <b>Next ←</b> dabaayein. Har takhti mein pehle samjhaane wala safha hai, phir asli Qaida ke safhe.</div></div>${foot("Start here",num)}</div>`;
  if(P.type==="key")return `<div class="pg"><div class="pg-body"><h3 class="pt">Reading the English spelling</h3><div class="keygrid">
    <div><b>ā ī ū</b> long vowels, stretch them · Hinglish: <b>aa ee oo</b></div>
    <div><b>a i u</b> short vowels: Zabar, Zer, Pesh</div>
    <div><b>ḥ</b> heavy h from the middle of the throat (ح)</div>
    <div><b>kh</b> rough sound like Scottish “loch” (خ)</div>
    <div><b>th</b> as in “think” (ث) · <b>dh</b> as in “this” (ذ)</div>
    <div><b>ṣ ḍ ṭ ẓ</b> heavy, full-mouth s, d, t, z (ص ض ط ظ)</div>
    <div><b>ʿ</b> the throat sound of ʿAin (ع)</div>
    <div><b>gh</b> gargled g, like French r (غ)</div>
    <div><b>q</b> deep k from the back of the tongue (ق)</div>
    <div><b>ʾ</b> a small catch in the voice: Hamza (ء)</div>
    <div><b>bb, mm</b> doubled letter: Tashdeed, hold it</div>
    <div><b>āā</b> extra-long Madd, 4–6 counts · Hinglish: <b>aaaa</b></div>
    <div><b>-</b> joins words that are read together</div></div>
    <p class="hint" style="margin-top:14px">Hinglish (green) is the same reading in everyday Indian spelling, with no special marks. Use the English line to catch the heavy and throat letters, and learn the true sounds from a Qari or Ustad.</p></div>${foot("Reading key",num)}</div>`;
  if(P.type==="contents")return `<div class="pg"><div class="pg-body"><h3 class="pt">Fehrist · Contents</h3><ul class="toc">${LESSONS.map((L,k)=>`<li><button type="button" data-gokey="lesson${k+1}"><span class="n">${k+1}</span><span class="t">${L.en}</span><span class="u">${L.ur}</span></button></li>`).join("")}<li><button type="button" data-gokey="kalima1"><span class="n">★</span><span class="t">Six Kalimas &amp; Iman</span><span class="u">چھ کلمے، ایمانِ مجمل، ایمانِ مفصّل</span></button></li></ul></div>${foot("Contents",num)}</div>`;
  if(P.type==="lesson"){const L=LESSONS[P.n-1],bp=BOOK_PAGES[P.n];
    return `<div class="pg"><div class="pg-body">
      <div class="lh"><div class="eyebrow">Takhti ${P.n} · ${L.tr}</div><div class="ur">تختی نمبر ${UD(P.n)} · ${L.ur}</div><h2>${L.en}</h2><div class="sub">${L.sub}</div></div>
      <p class="note en"><strong>How to read:</strong> ${mk(L.n)}</p><p class="note hi"><strong>Kaise padhein:</strong> ${mk(L.h)}</p>
      ${L.body()}
      <div class="goread"><span class="ar">←</span><span>Now read Takhti ${P.n} from the Qaida (book page${bp.length>1?"s":""} ${bp.map(p=>p-2).join(", ")}). Turn the page.</span></div>${P.n<27?`<button type="button" class="skip" data-gokey="lesson${P.n+1}">Already know this? Skip to Takhti ${P.n+1} ←</button>`:""}
    </div>${foot("Takhti "+P.n+" · explanation",num)}</div>`}
  return `<div class="pg"><div class="pg-body"><div class="cover">
    <div class="bism">اَلْحَمْدُ لِلّٰهِ</div><div class="en">You have finished the Qaida</div>
    <p>Keep revising, and recite the Quran with a teacher to perfect your Tajweed.</p>
    <div class="devby"><span>Developed by</span><b>m2hxa</b></div></div></div></div>${foot("Khatam",num)}</div>`;
}

/* ---------- layout: single page or two-page spread ---------- */
const stage=document.getElementById("stage"),slotA=document.getElementById("slotA"),slotB=document.getElementById("slotB"),
      leaf=document.getElementById("leaf"),leafFront=document.getElementById("leafFront"),leafBack=document.getElementById("leafBack"),desk=document.getElementById("desk");
const RATIO=277/403, FOOT=34, DW=600;
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const DUR=reduce?0:760; stage.style.setProperty("--dur",DUR+"ms");
let spread=false, idx=0, busy=false;

function buildSeq(){
  if(!spread)return PAGES.slice();
  const out=[];PAGES.forEach(P=>{if(P.type==="lesson"&&out.length%2===1)out.push({type:"divider",n:P.n,key:"div"+P.n});out.push(P)});
  if(out.length%2)out.push({type:"blank",key:"blank"});return out}
function layout(){
  const r=desk.getBoundingClientRect();const aw=r.width-32,ah=r.height-24;
  const wSingle=Math.min(aw,ah*RATIO), wSpread=Math.min(aw/2,ah*RATIO);
  const wantSpread=aw>=640&&ah>=460&&wSpread>=0.9*wSingle;
  const w=Math.max(160,Math.min(wantSpread?wSpread:wSingle,980));const h=Math.max(w/RATIO,Math.min(ah,w/0.56));
  stage.style.width=(wantSpread?2*w:w)+"px";stage.style.height=h+"px";
  stage.style.setProperty("--pw",w+"px");stage.style.setProperty("--s",(w/DW).toFixed(4));
  stage.style.setProperty("--dh",(DW*(h-FOOT)/w).toFixed(1)+"px");
  document.documentElement.style.setProperty("--pagefs",Math.max(13,Math.min(26,w*0.034))+"px");
  if(wantSpread!==spread||!SEQ){const key=SEQ?SEQ[idx].key:null;spread=wantSpread;SEQ=buildSeq();
    stage.classList.toggle("spread",spread);stage.classList.toggle("single",!spread);
    let i=key?SEQ.findIndex(p=>p.key===key):0;if(i<0)i=0;show(i,true)}
  else{fitBook(stage)}
}
const norm=i=>spread?i-(i%2):i;
function paint(el,i){el.innerHTML=i>=0&&i<SEQ.length?render(i):"";el.dataset.i=i}
function show(i,force){
  i=Math.max(0,Math.min(norm(i),SEQ.length-1));
  if(!force&&i===idx&&slotA.dataset.i==String(i))return;
  idx=i;paint(slotA,i);if(spread)paint(slotB,i+1);else slotB.innerHTML="";
  fitBook(stage);store.set("nq-pagekey",SEQ[i].key);
  const P=SEQ[spread&&SEQ[i+1]&&SEQ[i+1].type==="book"?i+1:i];if(lessonOfPage(P))store.set("nq-lastkey",P.key);
  if(i>0&&!store.get("nq-hinted")){const h=document.getElementById("hint");h.hidden=false;setTimeout(()=>{h.hidden=true},6500);store.set("nq-hinted","1")}
  updateChrome();
}
function updateChrome(){
  const n=lessonOf(spread?Math.min(idx+1,SEQ.length-1):idx),P=SEQ[idx];
  document.getElementById("where").textContent=n?`Takhti ${n} · ${LESSONS[n-1].en}`:(P.type==="contents"?"Contents":P.type==="key"?"Reading key":P.type==="howto"?"How to use":P.type==="kalima"?"Six Kalimas & Iman":P.type==="end"?"Khatam":"Cover");
  document.getElementById("pgSub").textContent=n?`Takhti ${n} of 27`:P.type==="kalima"||P.type==="end"?"After the Qaida":"Introduction";
  stage.classList.toggle("on-cover",idx===0);
  const step=spread?2:1, last=SEQ.length-step;
  document.getElementById("pgLabel").textContent=spread?`Pages ${idx+1}–${Math.min(idx+2,SEQ.length)} of ${SEQ.length}`:`Page ${idx+1} of ${SEQ.length}`;
  document.getElementById("barFill").style.width=(idx/Math.max(1,last)*100)+"%";
  document.getElementById("nextBtn").disabled=idx>=last;
  document.getElementById("prevBtn").disabled=idx<=0;
}
function turn(dir){
  if(busy)return;const step=spread?2:1,to=idx+dir*step;if(to<0||to>SEQ.length-1)return;
  stage.classList.remove("zoom","showleg");
  if(!DUR){show(to);return}
  busy=true;leaf.className="leaf";
  if(!spread){
    if(dir>0){leafFront.innerHTML=slotA.innerHTML;copyScroll(slotA,leafFront);paint(slotA,to);leafBack.innerHTML="";leaf.classList.add("s-fwd")}
    else{paint(leafFront,to);leafBack.innerHTML="";leaf.classList.add("s-back")}
  }else{
    if(dir>0){leafFront.innerHTML=slotB.innerHTML;paint(leafBack,to);paint(slotB,to+1);leaf.classList.add("p-fwd")}
    else{leafFront.innerHTML=slotA.innerHTML;paint(leafBack,to+1);paint(slotA,to);leaf.classList.add("p-back")}
  }
  leaf.hidden=false;fitBook(stage);void leaf.offsetWidth;leaf.classList.add("go");
  setTimeout(()=>{leaf.hidden=true;leaf.className="leaf";leafFront.innerHTML="";leafBack.innerHTML="";show(to,true);busy=false},DUR);
}
function copyScroll(a,b){const s=a.querySelector(".pg-body");const t=b.querySelector(".pg-body");if(s&&t)t.scrollTop=s.scrollTop}
function jump(i){if(busy)return;i=norm(i);if(i===idx)return;stage.classList.remove("zoom","jump");void stage.offsetWidth;show(i);stage.classList.add("jump")}
function jumpKey(k){const i=SEQ.findIndex(p=>p.key===k);if(i>=0)jump(i)}

/* ---------- controls ---------- */
document.getElementById("nextBtn").onclick=()=>turn(1);
document.getElementById("prevBtn").onclick=()=>turn(-1);
const drawer=document.getElementById("drawer"),scrim=document.getElementById("scrim"),tocBtn=document.getElementById("tocBtn");
document.getElementById("drawerList").innerHTML=LESSONS.map((L,k)=>`<li><button type="button" data-gokey="lesson${k+1}" data-n="${k+1}"><span class="n">${k+1}</span><span class="t">${L.en}<small>${L.tr}</small></span><span class="ck" aria-label="done">✓</span><span class="u">${L.ur}</span></button></li>`).join("")+
  `<li><button type="button" data-gokey="kalima1"><span class="n">★</span><span class="t">Six Kalimas &amp; Iman<small>Mujmal · Mufassal</small></span><span class="u">چھ کلمے، ایمانِ مجمل، ایمانِ مفصّل</span></button></li>`;
PAGES.forEach(P=>{if(P.type==="lesson")P.key="lesson"+P.n});
function openDrawer(on){if(on)refreshProgress();drawer.hidden=!on;scrim.hidden=!on;tocBtn.setAttribute("aria-expanded",String(on));
  if(on){const n=lessonOf(spread?idx+1:idx);drawer.querySelectorAll("[data-n]").forEach(b=>b.classList.toggle("cur",+b.dataset.n===n));const c=drawer.querySelector(".cur");if(c)c.scrollIntoView({block:"center"})}}
tocBtn.onclick=()=>openDrawer(drawer.hidden);scrim.onclick=()=>openDrawer(false);
document.getElementById("drawerClose").onclick=()=>openDrawer(false);
drawer.addEventListener("click",e=>{const g=e.target.closest("[data-gokey]");if(g){openDrawer(false);jumpKey(g.dataset.gokey)}});
document.getElementById("homeBtn").onclick=()=>jump(0);
document.getElementById("edgeNext").onclick=()=>turn(1);
document.getElementById("edgePrev").onclick=()=>turn(-1);
const hint=document.getElementById("hint");hint.onclick=()=>hint.hidden=true;
addEventListener("keydown",e=>{if(e.key==="Escape"){openDrawer(false);return}if(e.target.closest("input"))return;if(e.key==="ArrowLeft"){e.preventDefault();turn(1)}else if(e.key==="ArrowRight"){e.preventDefault();turn(-1)}});
stage.addEventListener("click",e=>{
  if(quizClick(e,()=>show(idx,true)))return;
  if(e.target.closest("[data-tjkey]")){stage.classList.toggle("showleg");return}
  if(stage.classList.contains("showleg")&&!e.target.closest(".tjleg")){stage.classList.remove("showleg")}
  const g=e.target.closest("[data-gokey]");if(g){jumpKey(g.dataset.gokey);return}
  if(e.target.closest("[data-next]")){turn(1);return}
  const z=e.target.closest("[data-zoom]");if(z){const on=!stage.classList.contains("zoom");stage.classList.toggle("zoom",on);stage.querySelectorAll("[data-zoom]").forEach(b=>b.textContent=on?"Fit":"Zoom")}});
let sx=0,sy=0,st=0;
stage.addEventListener("pointerdown",e=>{sx=e.clientX;sy=e.clientY;st=Date.now()});
stage.addEventListener("pointerup",e=>{const dx=e.clientX-sx,dy=e.clientY-sy;if(stage.classList.contains("zoom"))return;
  if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5&&Date.now()-st<800)turn(dx>0?1:-1)});

const panel=document.getElementById("panel"),setBtn=document.getElementById("setBtn");
setBtn.onclick=()=>{panel.hidden=!panel.hidden;setBtn.setAttribute("aria-expanded",String(!panel.hidden))};
document.addEventListener("click",e=>{if(!panel.hidden&&!e.target.closest("#panel,#setBtn")){panel.hidden=true;setBtn.setAttribute("aria-expanded","false")}});
function seg(id,key,apply,def){const el=document.getElementById(id);const set=v=>{el.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.v===v)));apply(v)};
  set(store.get(key)||def);el.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;set(b.dataset.v);store.set(key,b.dataset.v)})}
seg("lang","nq-lang",v=>{document.body.classList.toggle("only-en",v==="en");document.body.classList.toggle("only-hi",v==="hi")},"both");
seg("theme","nq-theme",v=>{if(v==="system")document.documentElement.removeAttribute("data-theme");else document.documentElement.setAttribute("data-theme",v)},"system");
const pr=document.getElementById("practice"),sz=document.getElementById("size");
if(store.get("nq-practice")==="1"){pr.checked=true;document.body.classList.add("practice")}
pr.onchange=()=>{document.body.classList.toggle("practice",pr.checked);store.set("nq-practice",pr.checked?"1":"0")};
const applySize=v=>document.documentElement.style.setProperty("--ar-size",v+"rem");
const ss=store.get("nq-size");if(ss){sz.value=ss;applySize(ss)}
sz.oninput=()=>{applySize(sz.value);store.set("nq-size",sz.value)};

let rT=0;addEventListener("resize",()=>{clearTimeout(rT);rT=setTimeout(layout,80)});
if(window.ResizeObserver)new ResizeObserver(()=>{clearTimeout(rT);rT=setTimeout(layout,80)}).observe(desk);
layout();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>fitBook(stage));
if(document.fonts&&document.fonts.addEventListener){let fT=0;document.fonts.addEventListener("loadingdone",()=>{clearTimeout(fT);fT=setTimeout(()=>fitBook(stage),30)})}

const tjSw=document.getElementById("tjOn");
if(store.get("nq-tj")==="0"){TJ_ON=false;tjSw.checked=false}
tjSw.onchange=()=>{TJ_ON=tjSw.checked;store.set("nq-tj",TJ_ON?"1":"0");show(idx,true)};
document.getElementById("resetProg").onclick=()=>{const b=document.getElementById("resetProg");
  if(b.dataset.sure!=="1"){b.dataset.sure="1";b.textContent="Tap again to clear all ticks";setTimeout(()=>{b.dataset.sure="";b.textContent="Reset my progress"},3500);return}
  try{localStorage.removeItem("nq-done")}catch(e){}for(const k in QUIZ_STATE)delete QUIZ_STATE[k];b.dataset.sure="";b.textContent="Progress cleared";refreshProgress();show(idx,true)};
refreshProgress();
