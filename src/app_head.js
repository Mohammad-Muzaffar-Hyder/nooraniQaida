/* ---------- which book pages belong to each takhti (PDF page numbers; printed page = PDF page − 2) ---------- */
const BOOK_PAGES={1:[3,4],2:[5,6,7,8],3:[9,10,11],4:[12,13,14,15,16,17],5:[18,19],6:[20],7:[21],8:[22],9:[23],10:[24],11:[25],12:[26],13:[27],14:[28],15:[29],16:[29],17:[30],18:[31],19:[31],20:[32],21:[32],22:[33],23:[34],24:[35,36],25:[37,38],26:[39],27:[40,41]};

/* ---------- build the page sequence ---------- */
const PAGES=[{type:"cover"},{type:"howto"},{type:"key"},{type:"contents"}];
const LESSON_START={};
for(let n=1;n<=27;n++){
  LESSON_START[n]=PAGES.length;
  PAGES.push({type:"lesson",n});
  if(n===1)PAGES.push({type:"makharij",n:1,key:"makharij"});
  const mine=BOOK_PAGES[n], next=BOOK_PAGES[n+1];
  const shared=next&&next.join()===mine.join();      // e.g. takhti 15 & 16 share one book page
  if(!shared){const who=Object.keys(BOOK_PAGES).filter(k=>BOOK_PAGES[k].join()===mine.join()).map(Number);
    mine.forEach((p,j)=>PAGES.push({type:"book",p,lessons:who,j,total:mine.length,key:"b"+p}));
    who.forEach(w=>PAGES.push({type:"quiz",n:w,key:"quiz"+w}));}
}
for(let k=0;k<8;k++)PAGES.push({type:"kalima",k,key:"kalima"+(k+1)});   // six Kalimas + Iman-e-Mujmal + Iman-e-Mufassal (extras.js)
PAGES.push({type:"end"});
PAGES.forEach((P,i)=>{if(!P.key)P.key=P.type+(P.n||"")+"_"+i});
function lessonOfPage(P){return P.type==="lesson"||P.type==="divider"||P.type==="quiz"||P.type==="makharij"?P.n:P.type==="book"?P.lessons[P.lessons.length-1]:0}
function lessonOf(i){const L=SEQ||PAGES;for(let k=i;k>=0;k--){const n=lessonOfPage(L[k]);if(n)return n;if(L[k].type==="contents"||L[k].type==="kalima"||L[k].type==="end")return 0}return 0}
let SEQ=null;

/* ---------- cover: emerald hardcover, gold geometric frame, the title typeset in gold Nastaliq ---------- */
function starPts(cx,cy,R,r,n,rot=0){let s="";for(let k=0;k<n*2;k++){const a=Math.PI*k/n+rot,rr=k%2?r:R;s+=(cx+rr*Math.sin(a)).toFixed(2)+","+(cy-rr*Math.cos(a)).toFixed(2)+" "}return s}
function rosette(){let g="";
  g+=`<polygon points="${starPts(200,200,196,150,16)}" class="g1"/>`;
  g+=`<polygon points="${starPts(200,200,182,140,16,Math.PI/16)}" class="g2"/>`;
  g+=`<circle cx="200" cy="200" r="134" class="g3"/><circle cx="200" cy="200" r="126" class="g4"/>`;
  for(let k=0;k<32;k++){const a=Math.PI*2*k/32;g+=`<circle cx="${(200+130*Math.sin(a)).toFixed(1)}" cy="${(200-130*Math.cos(a)).toFixed(1)}" r="1.8" class="gd"/>`}
  return `<svg class="rosette" viewBox="0 0 400 400" aria-hidden="true">${g}</svg>`}
function corner(cls){return `<svg class="corner ${cls}" viewBox="0 0 100 100" aria-hidden="true"><path d="M4 4 H58 M4 4 V58" class="cl"/><path d="M12 12 H44 M12 12 V44" class="cl thin"/><polygon points="${starPts(30,30,16,7,8)}" class="cs"/><circle cx="30" cy="30" r="3.2" class="gd"/></svg>`}
function coverHTML(){
  const savedKey=store.get("nq-lastkey");const sp=savedKey?PAGES.find(p=>p.key===savedKey):null;const sl=sp?lessonOfPage(sp)||0:0;
  return `<div class="pg cover-pg"><div class="cv-pattern"></div><div class="cv-frame"></div>
    ${corner("tl")}${corner("tr")}${corner("bl")}${corner("br")}
    <div class="cv-inner">
      <div class="cv-bism">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
      <div class="medal">${rosette()}<div class="callig" lang="ur" aria-label="نورانی قاعدہ — Noorani Qaida"><span>نورانی</span><span>قاعدہ</span></div></div>
      <div class="cv-title">Noorani Qaida</div>
      <div class="cv-sub">Indian Edition · 27 Takhtis</div>
      <div class="cv-rule"><span></span><svg viewBox="0 0 20 20" aria-hidden="true"><polygon points="${starPts(10,10,9,4,8)}"/></svg><span></span></div>
      <p class="cv-lede">Learn to read the Quran, takhti by takhti, with English and Hinglish help.</p>
      ${(()=>{const dc=doneCount();return dc?`<div class="cv-prog"><div class="cv-bar"><i style="width:${dc/27*100}%"></i></div><span>${dc} of 27 takhtis done</span></div>`:""})()}
      <div class="cv-actions">
        <button type="button" class="cv-btn" data-next>Start reading ←</button>
        ${sl?`<button type="button" class="cv-btn ghost" data-gokey="${savedKey}">Continue · Takhti ${sl}</button>`:""}
        ${typeof installHTML==="function"?installHTML():""}
      </div>
    </div></div>`}

