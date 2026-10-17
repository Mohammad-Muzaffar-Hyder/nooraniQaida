/* ---------- progress ---------- */
function doneMap(){try{return JSON.parse(localStorage.getItem("nq-done")||"{}")||{}}catch(e){return {}}}
function setDone(n,score){const d=doneMap();if(score===null)delete d[n];else d[n]=score;try{localStorage.setItem("nq-done",JSON.stringify(d))}catch(e){}refreshProgress()}
function doneCount(){return Object.keys(doneMap()).length}
function refreshProgress(){
  const d=doneMap();
  document.querySelectorAll("#drawerList [data-n]").forEach(b=>b.classList.toggle("done",!!d[b.dataset.n]));
  const c=document.getElementById("drawerDone");if(c)c.textContent=`${Object.keys(d).length} of 27 takhtis done`;
}

/* ---------- concept questions, one per takhti (answer is always the first option; options are shuffled) ---------- */
const CONCEPT={
1:["Which of these letters is heavy (pur), read with a full mouth?",["ص","س","ت","ث"],1],
2:["Which letter never joins to the letter after it?",["د","ب","س","ل"],1],
3:["Which one has Zabar?",["بَ","بِ","بُ","بْ"],1],
4:["How is Alif after Zabar (بَا) read?",["Long, about 2 counts","Short and quick","Through the nose","It is not read"]],
5:["Which one is a Leen (soft) sound?",["بَوْ","بُوْ","بِیْ","بَا"],1],
6:["Khara Zabar ( ٰ ) is read as long as…",["Alif after Zabar","a short Zabar","a Tashdeed","Tanween"]],
7:["Two Pesh ( ٌ ) are read as…",["un","an","in","u"]],
8:["بًا sounds the same as…",["بَنْ","بِنْ","بُنْ","بَا"],1],
9:["In Izhar, the n of Noon Saakin or Tanween is read…",["Clearly, without ghunnah","Hidden in the nose","Changed into meem","Merged into the next letter"]],
10:["How many Ikhfa letters are there?",["15","6","14","4"]],
11:["Which letters have Qalqalah?",["ق ط ب ج د","ء ه ع ح غ خ","ی ر م ل و ن","ت ث ذ ز"],1],
12:["A letter with Jazm ( ْ ) is…",["Joined to the letter before it","Read with Zabar","Skipped","Stretched for 2 counts"]],
13:["How is اَبَّ read?",["ab-ba","a-ba","ab","ab-bi"]],
14:["When Ra has Zer, it is read…",["Thin (baareek)","Heavy (pur)","With ghunnah","Silently"]],
15:["In وَالشَّمْسِ the Laam of اَلْ is…",["Silent","Read clearly","Read with ghunnah","Read twice"]],
16:["In بِسْمِ اللّٰهِ the Laam of Allah is read…",["Thin, because of the Zer before it","Heavy, with a full mouth","Silently","With ghunnah"]],
17:["When you stop on اَحَدًا you read…",["ahadaa","ahad","ahadun","ahadin"]],
18:["How many Tashdeeds are in یَذَّكَّرُ?",["2","1","3","0"]],
19:["Madd Muttasil is when the hamza comes…",["In the same word","In the next word","After a Tashdeed","Before the madd letter"]],
20:["In الضَّآلِّیْنَ the madd is…",["Madd Laazim, about 6 counts","Madd Munfasil","Madd Muttasil","No madd at all"]],
21:["How is الٓمّٓ read?",["Alif Laaam Meeem","Alam","Almu","Alim"]],
22:["Meem Saakin before ب is read with…",["Ikhfa Shafawi","Izhar Shafawi","Idgham Shafawi","Iqlab"]],
23:["In Iqlab, Noon Saakin before ب changes into…",["Meem","Laam","Noon with Tashdeed","Nothing"]],
24:["Idgham without ghunnah happens before…",["ل and ر","ی and و","م and ن","ب"]],
25:["A letter marked with a small circle ( ۟ ) is…",["Not read","Read long","Read with ghunnah","Read twice"]],
26:["The sign لا in the middle of an ayah means…",["Do not stop here","You must stop","Stopping is better","Pause without breathing"]],
27:["Which sign means you must stop?",["مـ","لا","صلے","ز"],1]
};
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

/* pairs of (Arabic, English reading) taken from a lesson's own explanation page */
const PAIR_CACHE={};
function lessonPairs(n){
  if(PAIR_CACHE[n])return PAIR_CACHE[n];
  const box=document.createElement("div");box.innerHTML=LESSONS[n-1].body();const out=[],seen=new Set();
  box.querySelectorAll(".ar").forEach(a=>{let e=a.nextElementSibling;while(e&&!(e.classList.contains("tr")&&e.classList.contains("en")))e=e.nextElementSibling;
    if(!e)return;const ar=a.textContent.trim(),t=e.textContent.trim();if(!ar||!t||seen.has(t)||ar.length>18)return;seen.add(t);out.push([ar,t])});
  return PAIR_CACHE[n]=out;
}
function makeQuiz(n){
  let pool=lessonPairs(n);
  for(let k=n-1;pool.length<6&&k>=1;k--)pool=pool.concat(lessonPairs(k).filter(p=>!pool.some(q=>q[1]===p[1])));
  const qs=[];const c=CONCEPT[n];qs.push({q:c[0],opts:shuffle(c[1]),ans:c[1][0],arOpts:!!c[2]});
  const picks=shuffle(pool).slice(0,4);
  picks.forEach((p,i)=>{const others=shuffle(pool.filter(x=>x[1]!==p[1]&&x[0]!==p[0])).slice(0,3);
    if(i%2===0)qs.push({q:"How do you read this?",show:p[0],opts:shuffle([p[1],...others.map(o=>o[1])]),ans:p[1],tr:true});
    else qs.push({q:"Which one is read as:",showTr:p[1],opts:shuffle([p[0],...others.map(o=>o[0])]),ans:p[0],arOpts:true});
  });
  return qs;
}
const QUIZ_STATE={};
function quizHTML(P,num){
  const n=P.n,L=LESSONS[n-1];let st=QUIZ_STATE[n];if(!st)st=QUIZ_STATE[n]={qs:makeQuiz(n),i:0,score:0,picked:null};
  const done=doneMap()[n];const showTr=t=>document.body.classList.contains("only-hi")?hing(t):t;
  let inner;
  if(st.i>=st.qs.length){const pass=st.score>=4;
    inner=`<div class="qz-end"><div class="qz-score ${pass?"ok":""}">${st.score}<small>/ ${st.qs.length}</small></div>
      <h3 class="pt">${pass?"Mubarak! Takhti "+n+" is done.":"Almost there"}</h3>
      <p class="qz-msg">${pass?"Takhti "+n+" is now ticked in your contents list. Turn the page to continue.":"Read the explanation and the Qaida page again, then try once more. You need 4 out of 5."}</p>
      <p class="qz-msg hi">${pass?"Shabaash! Takhti "+n+" mukammal ho gayi.":"Ek baar phir padhein, phir dobara koshish karein. 5 mein se 4 sahi chahiye."}</p>
      <div class="qz-actions"><button type="button" class="qz-btn ghost" data-qz="retry">Try again</button>${pass?"":`<button type="button" class="qz-btn ghost" data-gokey="lesson${n}">Back to Takhti ${n}</button>`}</div></div>`;
  }else{const q=st.qs[st.i],pk=st.picked;
    inner=`<div class="qz-top"><span>Question ${st.i+1} of ${st.qs.length}</span><span class="qz-dots">${st.qs.map((_,k)=>`<i class="${k<st.i?"past":k===st.i?"now":""}"></i>`).join("")}</span></div>
      <div class="qz-q">${q.q}</div>
      ${q.show?`<div class="qz-show">${q.show}</div>`:""}${q.showTr?`<div class="qz-showtr">“${showTr(q.showTr)}”</div>`:""}
      <div class="qz-opts ${q.arOpts?"ar-opts":""}">${q.opts.map(o=>{const st2=pk===null?"":o===q.ans?"right":o===pk?"wrong":"dim";
        return `<button type="button" class="qz-opt ${st2}" data-qz="pick" data-v="${encodeURIComponent(o)}" ${pk!==null?"disabled":""}>${q.tr?showTr(o):o}</button>`}).join("")}</div>
      ${pk!==null?`<div class="qz-fb ${pk===q.ans?"ok":"no"}">${pk===q.ans?"Correct · Sahi jawab":"Not quite. The answer is "+(q.tr?showTr(q.ans):`<span class="ar-in">${q.ans}</span>`)}</div><button type="button" class="qz-btn" data-qz="next">${st.i+1<st.qs.length?"Next question":"See result"}</button>`:""}`;
  }
  return `<div class="pg quizpg"><div class="pg-body">
    <div class="lh"><div class="eyebrow">Takhti ${n} · Quick check</div><h2>${L.en}</h2><div class="sub">5 questions. Get 4 right to complete this takhti.</div></div>
    ${inner}
    <label class="qz-mark"><input type="checkbox" data-qz="mark" ${done?"checked":""}> I have learnt this takhti — mark it done</label>
  </div>${foot("Takhti "+n+" · quiz"+(done?" ✓":""),num)}</div>`;
}
function quizClick(e,rerender){
  const b=e.target.closest("[data-qz]");if(!b)return false;
  const pg=b.closest(".quizpg");const n=+pg.dataset.n;const st=QUIZ_STATE[n];const a=b.dataset.qz;
  if(a==="mark"){setDone(n,b.checked?(doneMap()[n]||"manual"):null);rerender();return true}
  if(a==="pick"&&st&&st.picked===null){st.picked=decodeURIComponent(b.dataset.v);if(st.picked===st.qs[st.i].ans)st.score++}
  else if(a==="next"&&st){st.i++;st.picked=null;if(st.i>=st.qs.length&&st.score>=4)setDone(n,st.score)}
  else if(a==="retry"){QUIZ_STATE[n]={qs:makeQuiz(n),i:0,score:0,picked:null}}
  rerender();return true;
}

/* ---------- Makharij: where each letter comes from ---------- */
function makharijHTML(num){
  const Z=[
    ["1","Jawf","جوف","Empty space of mouth & throat","ا و ی","madd letters"],
    ["2","Halq","حلق","Throat","ء ه · ع ح · غ خ","deep · middle · top of throat"],
    ["3","Back of tongue","اقصیٰ لسان","Back of tongue + soft palate","ق ك",""],
    ["4","Middle of tongue","وسط لسان","Middle of tongue + hard palate","ج ش ی",""],
    ["5","Side of tongue","حافۂ لسان","Side edge of tongue + upper molars","ض",""],
    ["6","Tip of tongue","طرفِ لسان","Tip of tongue + gums / teeth","ل ن ر · ت د ط · ز س ص · ث ذ ظ","gums · upper gum · teeth · teeth edges"],
    ["7","Lips","شفتان","Lips","ف · ب م و","lip + teeth · both lips"],
    ["8","Nose","خیشوم","Nasal passage","نّ مّ","ghunnah"]];
  return `<div class="pg"><div class="pg-body">
    <div class="lh"><div class="eyebrow">Takhti 1 · Extra</div><div class="ur">مخارجِ حروف</div><h2>Makharij: where each letter comes from</h2><div class="sub">Say each letter with a Sukun before it (اَبْ، اَتْ) to feel exactly where it starts.</div></div>
    <figure class="mk-fig">
    <svg viewBox="0 0 420 360" role="img" aria-label="Side view of the head showing the eight places where letters are pronounced">
      <path class="mk-head" d="M300 30 C 220 10, 120 30, 100 110 C 95 130, 80 140, 66 162 C 60 172, 70 178, 82 180 C 78 192, 80 200, 90 204 C 84 212, 88 222, 98 226 C 94 236, 96 248, 110 250 C 130 254, 150 252, 160 262 L 168 340 L 300 340 C 300 300, 310 270, 330 240 C 360 190, 370 120, 340 70 C 330 50, 318 38, 300 30 Z"/>
      <path class="mk-cav" d="M104 196 C 140 186, 190 180, 230 186 C 252 190, 262 204, 262 222 L 262 330 L 240 330 L 240 232 C 238 218, 228 212, 212 212 C 180 214, 140 218, 104 210 Z"/>
      <path class="mk-tongue" d="M108 206 C 130 196, 170 192, 205 196 C 228 199, 238 210, 238 228 L 238 250 C 220 236, 200 232, 170 234 C 140 236, 118 230, 108 220 Z"/>
      <path class="mk-nose" d="M96 150 C 130 150, 190 146, 250 150 C 262 151, 266 160, 262 170 C 230 168, 160 168, 100 172 Z"/>
      <path class="mk-palate" d="M108 186 C 150 178, 200 176, 236 182"/>
      <line class="mk-lead" x1="251" y1="226" x2="300" y2="226"/><circle class="mk-dot" cx="251" cy="226" r="11"/><text class="mk-num" x="251" y="230">1</text>
      <line class="mk-lead" x1="252" y1="290" x2="300" y2="290"/><circle class="mk-dot" cx="252" cy="290" r="11"/><text class="mk-num" x="252" y="294">2</text>
      <circle class="mk-dot" cx="214" cy="201" r="11"/><text class="mk-num" x="214" y="205">3</text>
      <circle class="mk-dot" cx="176" cy="198" r="11"/><text class="mk-num" x="176" y="202">4</text>
      <circle class="mk-dot" cx="150" cy="222" r="11"/><text class="mk-num" x="150" y="226">5</text>
      <circle class="mk-dot" cx="122" cy="203" r="11"/><text class="mk-num" x="122" y="207">6</text>
      <circle class="mk-dot" cx="76" cy="190" r="11"/><text class="mk-num" x="76" y="194">7</text>
      <circle class="mk-dot" cx="150" cy="160" r="11"/><text class="mk-num" x="150" y="164">8</text>
      <text class="mk-lbl" x="306" y="230">jawf</text><text class="mk-lbl" x="306" y="294">throat</text>
    </svg></figure>
    <div class="mk-list">${Z.map(z=>`<div class="mk-row"><span class="mk-n">${z[0]}</span><div class="mk-t"><b>${z[1]} <span class="mk-ur">${z[2]}</span></b><small>${z[3]}${z[5]?" · "+z[5]:""}</small></div><span class="mk-l">${z[4]}</span></div>`).join("")}</div>
    <p class="hint" style="margin-top:12px">The diagram is a simple guide. Learn the exact makhraj of each letter by listening to a Qari or Ustad.</p>
  </div>${foot("Takhti 1 · Makharij",num)}</div>`;
}
