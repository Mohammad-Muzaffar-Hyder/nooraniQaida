/* ---------- tajweed colouring (book pages from Takhti 9 onward) ----------
   Rules: ghunnah (نّ مّ), ikhfa & ikhfa shafawi, idgham & idgham shafawi, iqlab (ۢ), qalqalah (قطبجد + sukun), madd (ٓ).
   Output uses attribute-free custom tags so words can still be split on spaces. */
const TJ_MARK=/[ً-ٰٟۖ-ۭ]/;
const TJ_IKHFA="تثجدذزسشصضطظفقكک";
const TJ_IDGHAM="يیرملون";
const TJ_QALQ="قطبجد";
function tjGraphemes(s){const out=[];for(const ch of s){if(TJ_MARK.test(ch)&&out.length&&!out[out.length-1].tag)out[out.length-1].t+=ch;else out.push({t:ch,b:ch})}return out}
function tjIsLetter(b){return /[ء-يٱکگیےٹ-ۓ]/.test(b)}
function tjNext(gs,i,afterTanween){
  let j=i+1;
  if(afterTanween){while(j<gs.length&&(gs[j].t==="ا"||gs[j].t==="ى"||gs[j].t==="ی"))j++}
  while(j<gs.length&&!tjIsLetter(gs[j].b)){if(gs[j].b==="{")return null;j++}
  if(j>=gs.length)return null;
  const g=gs[j];if(g.b==="ا"&&g.t.length===1)return null;   // hamzat-ul-wasl: rule does not apply
  return g.b;
}
function tjClass(gs,i){
  const g=gs[i],b=g.b,m=g.t.slice(1);
  if(!tjIsLetter(b))return null;
  const shadda=m.includes("ّ"),sukun=m.includes("ْ"),tan=/[ً-ٍ]/.test(m);
  if((b==="ن"||b==="م")&&shadda)return "g";
  if(m.includes("ٓ")||b==="آ")return "m";
  if(m.includes("ۢ"))return "iq";
  if((b==="ن"&&sukun)||tan){const nx=tjNext(gs,i,tan);if(!nx)return null;if(nx==="ب")return "iq";if(TJ_IKHFA.includes(nx))return "ik";if(TJ_IDGHAM.includes(nx))return "id";return null}
  if(b==="م"&&sukun){const nx=tjNext(gs,i,false);if(nx==="ب")return "ik";if(nx==="م")return "id";return null}
  if(TJ_QALQ.includes(b)&&sukun)return "q";
  return null;
}
function tj(s){
  if(!s)return s;
  const gs=tjGraphemes(s);let out="",inBrace=false;
  for(let i=0;i<gs.length;i++){const g=gs[i];if(g.b==="{")inBrace=true;
    const c=inBrace?null:tjClass(gs,i);
    out+=c?`<tj-${c}>${g.t}</tj-${c}>`:g.t;
    if(g.b==="}")inBrace=false}
  return out;
}
const TJ_LEGEND=[["g","Ghunnah","غنّہ","nasal hum, 2 counts"],["ik","Ikhfa","اخفاء","hide the n/m sound in the nose"],["id","Idgham","ادغام","merge into the next letter"],["iq","Iqlab","اقلاب","n becomes m before ب"],["q","Qalqalah","قلقلہ","small echo / bounce"],["m","Madd","مدّ","stretch 4–6 counts"]];
