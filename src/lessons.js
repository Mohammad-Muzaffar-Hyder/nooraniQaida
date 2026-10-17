const F="َ",K="ِ",D="ُ",S="ْ",SH="ّ",FT="ً",KT="ٍ",DT="ٌ",SA="ٰ",SY="ٖ",UP="ٗ";

const LETTERS=[
 ["ا","الف","Alif","a / silent carrier",""],
 ["ب","بے","Ba","b as in boy","b"],
 ["ت","تے","Ta","soft t","t"],
 ["ث","ثے","Tha (Sa)","th as in think","th"],
 ["ج","جیم","Jeem","j as in jam","j"],
 ["ح","حا","Ḥa (badi he)","heavy throat h","ḥ"],
 ["خ","خا","Kha","kh as in loch","kh"],
 ["د","دال","Daal","soft d","d"],
 ["ذ","ذال","Dhaal (Zaal)","th as in this","dh"],
 ["ر","رے","Ra","rolled r","r"],
 ["ز","زے","Za","z as in zoo","z"],
 ["س","سین","Seen","s as in sun","s"],
 ["ش","شین","Sheen","sh as in ship","sh"],
 ["ص","صاد","Ṣaad (Suad)","heavy s","ṣ"],
 ["ض","ضاد","Ḍaad (Zuad)","heavy d","ḍ"],
 ["ط","طوئے","Ṭa (Toa)","heavy t","ṭ"],
 ["ظ","ظوئے","Ẓa (Zoa)","heavy th / z","ẓ"],
 ["ع","عین","ʿAin","throat sound","ʿ"],
 ["غ","غین","Ghain","gargled g","gh"],
 ["ف","فے","Fa","f as in fan","f"],
 ["ق","قاف","Qaaf","deep k","q"],
 ["ك","کاف","Kaaf","k as in kite","k"],
 ["ل","لام","Laam","l as in lamp","l"],
 ["م","میم","Meem","m as in moon","m"],
 ["ن","نون","Noon","n as in noon","n"],
 ["و","واؤ","Waaw","w as in water","w"],
 ["ه","ہا","Ha (chhoti he)","light h","h"],
 ["ء","ہمزہ","Hamza","catch in the voice","ʾ"],
 ["ي","یے","Ya","y as in yes","y"]
];
const NAME={};LETTERS.forEach(l=>NAME[l[0]]=l[2].split(" ")[0]);
const CONS={};LETTERS.forEach(l=>CONS[l[0]]=l[4]);
const VOWEL_LETTERS=LETTERS.filter(l=>l[0]!=="ء");
const NONJOIN="اأدذرزو";

/* Hinglish: the same reading written the everyday Indian way (aa, ee, oo; no special marks) */
function hing(s){return s.replace(/āā/g,"aaaa").replace(/īī/g,"eeee").replace(/ūū/g,"oooo")
 .replace(/ā/g,"aa").replace(/ī/g,"ee").replace(/ū/g,"oo").replace(/Ā/g,"Aa").replace(/Ī/g,"Ee").replace(/Ū/g,"Oo")
 .replace(/ḥ/g,"h").replace(/Ḥ/g,"H").replace(/ṣ/g,"s").replace(/Ṣ/g,"S").replace(/ḍ/g,"d").replace(/Ḍ/g,"D")
 .replace(/ṭ/g,"t").replace(/Ṭ/g,"T").replace(/ẓ/g,"z").replace(/Ẓ/g,"Z").replace(/[ʿʾ]/g,"'")}
const T=t=>`<div class="tr en">${t}</div><div class="tr hi">${hing(t)}</div>`;
const tile=(ar,tr,extra="",cls="")=>`<div class="tile ${cls}"><div class="ar">${ar}</div>${extra}${T(tr)}</div>`;
const words=list=>`<div class="grid words">${list.map(([a,t,h])=>`<div class="tile"><div class="ar">${a}</div>${T(t)}${h?`<div class="hint">${h}</div>`:""}</div>`).join("")}</div>`;
const gt=(en,ar)=>`<div class="group-title">${en}${ar?` <span class="ar-in">${ar}</span>`:""}</div>`;
function triads(rows){return `<div class="grid tri">${rows.map(r=>`<div class="triad">${r.map(([a,t])=>`<div><div class="ar">${a}</div>${T(t)}</div>`).join("")}</div>`).join("")}</div>`}
const vowelTriads=fn=>triads(VOWEL_LETTERS.map(l=>fn(l[0],l[4])));
const pairs=(list,fn)=>`<div class="grid" style="--min:96px">${list.flatMap(fn).join("")}</div>`;
function ayat(list){return `<div class="ayat">${list.map(([a,t,m])=>`<div class="ayah"><div class="ar">${a}</div>${T(t)}<div class="mean">${m}</div></div>`).join("")}</div>`}
const signs=list=>`<div class="signs">${list.map(([s,n,m])=>`<div class="sign"><div class="ar">${s}</div><div><b>${n}</b><span>${m}</span></div></div>`).join("")}</div>`;

/* --- the 27 lessons, in the order of the Indian edition's contents list --- */
const LESSONS=[
{en:"Singular Letters",tr:"Huroof-e-Mufradaat",ur:"حروفِ مفردات",sub:"The 29 single letters of the alphabet",
 n:"Say each letter's name clearly, from right to left. Letters on a green tile are <em>pur</em> (heavy, full-mouth).",
 h:"Har harf ka naam saaf saaf bolein, daayein (right) se baayein (left). Hare (green) dabbe wale harf <em>pur</em> hain — moti, bhari awaaz se, munh bhar ke.",
 body:()=>`<div class="grid" style="--min:104px">${LETTERS.map(l=>tile(l[0],l[2],`<div class="ur-name">${l[1]}</div>`,"lg"+("خصضغطقظ".includes(l[0])?" heavy":""))).join("")}</div>`},

{en:"Combined Letters",tr:"Huroof-e-Murakkabaat",ur:"حروفِ مرکبات",sub:"How each letter changes shape when joined",
 n:"Read joined letters by their names, e.g. <b>بب</b> = “Ba Ba”. Six letters (ا د ذ ر ز و) never join to the letter after them.",
 h:"Jude hue harf unke naam se padhein, jaise <b>بب</b> = “Ba Ba”. Chhe harf (ا د ذ ر ز و) agle harf se kabhi nahi judte.",
 body:()=>gt("Shapes: alone · start · middle · end")+
 `<div class="grid" style="--min:150px">${VOWEL_LETTERS.map(l=>{const c=l[0];const f=NONJOIN.includes(c)?[c,c,"ـ"+c,"ـ"+c]:[c,c+"ـ","ـ"+c+"ـ","ـ"+c];return `<div class="tile"><div class="ar" style="letter-spacing:.15em">${f.join(" ")}</div>${T(l[2].split(" ")[0])}</div>`}).join("")}</div>`+
 gt("Practice: read by letter names")+
 `<div class="grid" style="--min:96px">${["لا","بب","تب","ثب","نب","يب","جب","حب","خب","سب","شب","صب","ضب","طب","ظب","عب","غب","فب","قب","كب","لب","مب","هب","بج","لج","مح","نخ","لم","سم","عم","فم","هم","كن","لن","بي","في","كي","لي","بلغ","كلم","نعم","بسم","ثلث","يلد","لكن","عسى","حتى","هذه"].map(w=>tile(w,w==="لا"?"Laam-Alif":[...w].map(c=>NAME[c]||(c==="ى"?"Ya":c)).join(" "))).join("")}</div>`},

{en:"Harakaat",tr:"Zabar · Zer · Pesh",ur:"حرکات",sub:"The three short vowels",
 n:"<b>Zabar</b> ( َ ) on top = short <b>a</b>; <b>Zer</b> ( ِ ) below = short <b>i</b>; <b>Pesh</b> ( ُ ) = short <b>u</b>. Read quickly, without stretching. Spell aloud first: “Ba zabar Ba, Ba zer Bi, Ba pesh Bu”.",
 h:"<b>Zabar</b> ( َ ) upar = chhota <b>a</b>; <b>Zer</b> ( ِ ) neeche = chhota <b>i</b>; <b>Pesh</b> ( ُ ) = chhota <b>u</b>. Jaldi padhein, kheenchein nahi. Pehle hijje karein: “Ba zabar Ba, Ba zer Bi, Ba pesh Bu”.",
 body:()=>vowelTriads((c,k)=>[[c+F,k+"a"],[c+K,k+"i"],[c+D,k+"u"]])+gt("Words")+
 words([["خَلَقَ","khalaqa","he created"],["كَتَبَ","kataba","he wrote"],["نَصَرَ","naṣara","he helped"],["ذَهَبَ","dhahaba","he went"],["جَعَلَ","jaʿala","he made"],["وَجَدَ","wajada","he found"],["حَسَدَ","ḥasada"],["كَفَرَ","kafara"],["رُسُلُ","rusulu"],["كُتُبُ","kutubu"],["اِبِلِ","ibili"],["عَمَدِ","ʿamadi"]])},

{en:"Huroof-e-ʿIllat / Huroof-e-Madd",tr:"Madd Asli",ur:"حروفِ علّت · حروفِ مدّ",sub:"Long vowels with ا و ي, and the standing harakaat",
 n:"Alif after Zabar = <b>ā</b>; Waaw saakin after Pesh = <b>ū</b>; Ya saakin after Zer = <b>ī</b>. Stretch them for two counts. The standing harakaat — <b>Khara Zabar</b> ( ٰ ), <b>Khari Zer</b> ( ٖ ), <b>Ulta Pesh</b> ( ٗ ) — are read just as long.",
 h:"Zabar ke baad Alif = <b>aa</b>; Pesh ke baad saakin Waao = <b>oo</b>; Zer ke baad saakin Ya = <b>ee</b>. Do (2) gintee tak kheenchein. <b>Khada Zabar</b> ( ٰ ), <b>Khadi Zer</b> ( ٖ ), <b>Ulta Pesh</b> ( ٗ ) bhi isi tarah lambe padhe jaate hain.",
 body:()=>gt("Madd letters")+vowelTriads((c,k)=>[[c+F+"ا",k+"ā"],[c+K+"يْ",k+"ī"],[c+D+"وْ",k+"ū"]])+
 gt("Standing harakaat")+vowelTriads((c,k)=>[[c+SA,k+"ā"],[c+SY,k+"ī"],[c+UP,k+"ū"]])},

{en:"Huroof-e-Leen",tr:"Letters of Leen",ur:"حروفِ لین",sub:"The soft sounds aw and ay",
 n:"Waaw saakin or Ya saakin after a <b>Zabar</b> is read softly and gently: <b>بَوْ</b> = <b>baw</b>, <b>بَيْ</b> = <b>bay</b>. Do not stretch.",
 h:"Zabar ke baad saakin Waao ya saakin Ya ko narmi se padhein: <b>بَوْ</b> = <b>bau</b>, <b>بَيْ</b> = <b>bai</b>. Kheenchein nahi.",
 body:()=>pairs(VOWEL_LETTERS.map(l=>l[0]).filter(c=>c!=="ا"),c=>[tile(c+F+"وْ",CONS[c]+"aw"),tile(c+F+"يْ",CONS[c]+"ay")])+gt("Words")+
 words([["يَوْمَ","yawma","day"],["خَوْفٍ","khawfin","fear"],["بَيْتِ","bayti","house"],["قُرَيْشٍ","qurayshin"],["صَيْفِ","ṣayfi","summer"],["عَلَيْكَ","ʿalayka"]])},

{en:"Exercise on Harakaat & Huroof-e-Madd",tr:"Mashq",ur:"حرکات اور حروفِ مدّ کی مشق",sub:"Reading words with short and long vowels",
 n:"Join the letters without pausing. Keep short vowels short, stretch madd letters for two counts.",
 h:"Harf bina ruke jodein. Chhoti harkat chhoti rakhein, madd wale harf 2 gintee tak kheenchein.",
 body:()=>words([["قَالَ","qāla","he said"],["قَالُوْا","qālū","they said"],["كَانُوْا","kānū"],["يَقُوْلُ","yaqūlu"],["قِيْلَ","qīla"],["فِيْهَا","fīhā"],["نُوْحِيْهَا","nūḥīhā"],["اُوْتِيْنَا","ūtīnā"],["صُدُوْرِ","ṣudūri"],["قُلُوْبُ","qulūbu"],["هٰذَا","hādhā","this"],["ذٰلِكَ","dhālika","that"],["مٰلِكِ","māliki"],["اِلٰهَ","ilāha"],["لَهٗ","lahū"],["بِهٖ","bihī"]])},

{en:"Tanween",tr:"Do Zabar · Do Zer · Do Pesh",ur:"تنوین",sub:"Double vowels that add an n sound",
 n:"Two Zabar ( ً ) = <b>an</b>, two Zer ( ٍ ) = <b>in</b>, two Pesh ( ٌ ) = <b>un</b>. A letter with tanween is called <em>munawwan</em>.",
 h:"Do zabar ( ً ) = <b>an</b>, do zer ( ٍ ) = <b>in</b>, do pesh ( ٌ ) = <b>un</b>. Tanween wale harf ko <em>munawwan</em> kehte hain.",
 body:()=>vowelTriads((c,k)=>[[c==="ا"?"اً":c+FT,k+"an"],[c+KT,k+"in"],[c+DT,k+"un"]])+gt("Words")+
 words([["اَحَدٌ","aḥadun","one"],["رُسُلٌ","rusulun"],["كُتُبٌ","kutubun"],["ثَمَرٌ","thamarun"],["غَضَبٌ","ghaḍabun"],["عَمَدٍ","ʿamadin"],["لُمَزَةٍ","lumazatin"],["مَلَكًا","malakan"],["بَلَدًا","baladan"],["اَبَدًا","abadan"]])},

{en:"Tanween & Noon Saakin",tr:"Tanween = Noon Saakin",ur:"تنوین اور نون ساکن",sub:"Tanween sounds exactly like a Noon with jazm",
 n:"Tanween is a hidden <b>نْ</b>. So <b>بً</b> sounds the same as <b>بَنْ</b> — both are <b>ban</b>. This is why the Noon Saakin rules also apply to tanween.",
 h:"Tanween asal mein chhupa hua <b>نْ</b> hai. <b>بً</b> aur <b>بَنْ</b> dono ek jaise padhe jaate hain — <b>ban</b>. Isi liye Noon Saakin ke qaayde tanween par bhi lagte hain.",
 body:()=>triads(VOWEL_LETTERS.filter(l=>l[0]!=="ا").map(([c,,,,k])=>[[c+FT+" · "+c+F+"نْ",k+"an"],[c+KT+" · "+c+K+"نْ",k+"in"],[c+DT+" · "+c+D+"نْ",k+"un"]]))},

{en:"Iz-haar of Noon Saakin & Tanween",tr:"Izhaar",ur:"اظہار",sub:"Say the n clearly before the six throat letters",
 n:"When Noon Saakin or tanween comes before a throat letter <b>ء ه ع ح غ خ</b>, read the n clearly, with no nasal hum.",
 h:"Noon Saakin ya tanween ke baad halq ka harf <b>ء ه ع ح غ خ</b> aaye to n saaf padhein, naak se gungunahat nahi.",
 body:()=>gt("Throat letters","ء ه ع ح غ خ")+words([["مِنْ هَادٍ","min hādin"],["مَنْ اٰمَنَ","man āmana"],["اَنْعَمْتَ","anʿamta"],["عَذَابٌ اَلِيْمٌ","ʿadhābun alīmun"],["مِنْ خَيْرٍ","min khayrin"],["يَنْحِتُوْنَ","yanḥitūna"],["مِنْ غِلٍّ","min ghillin"],["عَلِيْمٌ حَكِيْمٌ","ʿalīmun ḥakīmun"]])},

{en:"Ikhfaa",tr:"Hiding the n",ur:"اخفا",sub:"Hide the n with a nasal hum before 15 letters",
 n:"Before the 15 letters below, the n of Noon Saakin or tanween is hidden: read it softly through the nose (<b>ghunnah</b>) for two counts.",
 h:"Neeche diye 15 harf se pehle Noon Saakin ya tanween ka n chhupa kar, naak se halki gungunahat (<b>ghunnah</b>) ke saath 2 gintee tak padhein.",
 body:()=>gt("Ikhfaa letters","ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك")+words([["اَنْتُمْ","antum","nasal n"],["مِنْ قَبْلِ","min qabli"],["يُنْفِقُوْنَ","yunfiqūna"],["مُنْذِرٌ","mundhirun"],["عَنْكُمْ","ʿankum"],["اَنْزَلْنَا","anzalnā"],["مَنْ جَآءَ","man jāʾa"],["رِيْحًا صَرْصَرًا","rīḥan ṣarṣaran"],["عَذَابًا شَدِيْدًا","ʿadhāban shadīdan"]])},

{en:"Jazam or Sakoon",tr:"Jazm",ur:"جزم · سکون",sub:"A letter with no vowel joins the letter before it",
 n:"The Jazm ( ْ ) means the letter has no vowel of its own. Join it to the letter before: <b>اَبْ</b> = <b>ab</b>.",
 h:"Jazm ( ْ ) ka matlab hai is harf ki apni koi harkat nahi. Ise pichhle harf se mila kar padhein: <b>اَبْ</b> = <b>ab</b>.",
 body:()=>gt("Qalqalah — these 5 letters bounce when they have Jazm","قُطْبُ جَدٍّ")+words([["اَبْ","ab(b)"],["اَجْ","aj(j)"],["اَدْ","ad(d)"],["اَطْ","aṭ(ṭ)"],["اَقْ","aq(q)"],["يَجْعَلُ","yajʿalu"],["لَقَدْ","laqad(d)"],["مُحِيْطٌ","muḥīṭun"]])+gt("All letters with Jazm")+vowelTriads((c,k)=>c==="ا"?[["اَءْ","aʾ"],["اِءْ","iʾ"],["اُءْ","uʾ"]]:[["اَ"+c+S,"a"+k],["اِ"+c+S,"i"+k],["اُ"+c+S,"u"+k]])},

{en:"Practice of Jazam or Sakoon",tr:"Mashq-e-Jazm",ur:"جزم کی مشق",sub:"Words with a vowel-less letter",
 n:"Spell first, then read the word in one breath.",
 h:"Pehle hijje karein, phir poora lafz ek saans mein padhein.",
 body:()=>words([["قُلْ","qul","say"],["لَمْ","lam"],["مِنْ","min","from"],["عَنْ","ʿan"],["يَعْلَمُ","yaʿlamu"],["اَنْعَمْتَ","anʿamta"],["لَمْ يَلِدْ","lam yalid"],["اِقْرَاْ","iqraʾ","read"],["اَلْحَمْدُ","al-ḥamdu"],["عَلَيْهِمْ","ʿalayhim"],["قُلْ اَعُوْذُ","qul aʿūdhu"],["نَسْتَعِيْنُ","nastaʿīnu"],["مَغْضُوْبِ","maghḍūbi"],["اِهْدِنَا","ihdinā"]])},

{en:"Tashdeed",tr:"Doubled letters",ur:"تشدید",sub:"The letter is read twice",
 n:"A letter with Tashdeed ( ّ ) is said twice: once joined to the letter before (with jazm), once with its own vowel. <b>اَبَّ</b> = <b>ab-ba</b>.",
 h:"Tashdeed ( ّ ) wala harf do baar padha jata hai: ek baar pichhle harf ke saath (jazm se), ek baar apni harkat ke saath. <b>اَبَّ</b> = <b>ab-ba</b>.",
 body:()=>vowelTriads((c,k)=>c==="ا"?[["اَءَّ","aʾʾa"],["اِءِّ","iʾʾi"],["اُءُّ","uʾʾu"]]:[["اَ"+c+SH+F,"a"+k+k+"a"],["اِ"+c+SH+K,"i"+k+k+"i"],["اُ"+c+SH+D,"u"+k+k+"u"]])+gt("Words")+
 words([["رَبِّ","rabbi","Lord"],["اِنَّ","inna"],["ثُمَّ","thumma"],["كُلُّ","kullu"],["اَمَّا","ammā"],["عَلَّمَ","ʿallama"],["حَقٌّ","ḥaqqun","truth"],["تَبَّتْ","tabbat"],["مُحَمَّدٌ","muḥammadun"],["اِيَّاكَ","iyyāka"]])},

{en:"Rules of the Letter Raa",tr:"Ra pur ya baareek",ur:"راء کے قواعد",sub:"When Ra is heavy and when it is light",
 n:"Ra is <b>heavy</b> with Zabar or Pesh, and when saakin after Zabar or Pesh. Ra is <b>light</b> with Zer, and when saakin after an original Zer (unless a heavy letter follows).",
 h:"Ra <b>moti (pur)</b> hoti hai jab us par zabar ya pesh ho, ya saakin ho aur pehle zabar/pesh ho. Ra <b>baareek</b> hoti hai jab us par zer ho, ya saakin ho aur pehle asli zer ho (agar baad mein mota harf na ho).",
 body:()=>gt("Heavy Ra")+words([["رَبِّ","rabbi","zabar"],["رُسُلٌ","rusulun","pesh"],["اَرْسَلْنَا","arsalnā","saakin after zabar"],["قُرْاٰنٌ","qurʾānun","saakin after pesh"],["اِرْجِعِيْٓ","irjiʿī","zer not original"],["قِرْطَاسٍ","qirṭāsin","heavy letter after"]])+
 gt("Light Ra")+words([["رِجَالٌ","rijālun","zer"],["رِزْقًا","rizqan","zer"],["فِرْعَوْنَ","firʿawna","saakin after zer"],["خَيْرٌ","khayr","stopping after ya saakin"]])},

{en:"Rules of the Letters Qamri & Shamsi",tr:"Moon and sun letters",ur:"حروفِ قمری و شمسی",sub:"Is the Laam of اَلْ read or not?",
 n:"Before a <b>Qamri</b> (moon) letter the Laam of <b>اَلْ</b> is read: <b>al-qamaru</b>. Before a <b>Shamsi</b> (sun) letter the Laam is silent and the next letter gets Tashdeed: <b>ash-shamsu</b>.",
 h:"<b>Qamri</b> harf se pehle <b>اَلْ</b> ka Laam padha jata hai: <b>al-qamaru</b>. <b>Shamsi</b> harf se pehle Laam nahi padha jata aur agle harf par tashdeed hoti hai: <b>ash-shamsu</b>.",
 body:()=>gt("14 Qamri letters","ا ب غ ح ج ك و خ ف ع ق ي م ه")+words([["اَلْقَمَرُ","al-qamaru","the moon"],["اَلْحَمْدُ","al-ḥamdu"],["اَلْكِتٰبُ","al-kitābu"],["اَلْاَرْضُ","al-arḍu"],["اَلْبَيْتُ","al-baytu"],["اَلْعِلْمُ","al-ʿilmu"],["اَلْمُلْكُ","al-mulku"],["اَلْيَوْمَ","al-yawma"]])+
 gt("14 Shamsi letters","ت ث د ذ ر ز س ش ص ض ط ظ ل ن")+words([["اَلشَّمْسُ","ash-shamsu","the sun"],["اَلرَّحْمٰنِ","ar-raḥmāni"],["اَلرَّحِيْمِ","ar-raḥīmi"],["اَلدِّيْنِ","ad-dīni"],["اَلنَّاسِ","an-nāsi"],["اَلصِّرَاطَ","aṣ-ṣirāṭa"],["اَلَّذِيْنَ","alladhīna"],["وَالتِّيْنِ","wat-tīni"]])},

{en:"Rules of the Letter Laam",tr:"Laam in the name Allah",ur:"لام کے قواعد",sub:"Heavy after a or u, light after i",
 n:"The Laam in <b>اللّٰه</b> is <b>heavy</b> when the letter before has Zabar or Pesh, and <b>light</b> when it has Zer. Every other Laam is always light.",
 h:"<b>اللّٰه</b> ka Laam <b>mota</b> padha jata hai jab pichhle harf par zabar ya pesh ho, aur <b>baareek</b> jab zer ho. Baaki har Laam hamesha baareek hai.",
 body:()=>gt("Heavy")+words([["اَللّٰهُ","Allāhu"],["قَالَ اللّٰهُ","qālallāhu"],["هُوَ اللّٰهُ","huwallāhu"],["رَسُوْلُ اللّٰهِ","rasūlullāhi"]])+
 gt("Light")+words([["بِسْمِ اللّٰهِ","bismillāhi"],["لِلّٰهِ","lillāhi"],["فِي اللّٰهِ","fillāhi"],["قُلِ اللّٰهُمَّ","qulillāhumma"]])},

{en:"Rules of the Waqf",tr:"How to stop on a word",ur:"وقف کے قواعد",sub:"What changes at the last letter when you stop",
 n:"When you stop, the last vowel becomes Jazm. Two Zabar become a long <b>ā</b>. A round Ta ( ة ) becomes <b>h</b>. Qalqalah letters <b>ق ط ب ج د</b> bounce with a small echo.",
 h:"Rukne par aakhri harkat jazm ban jaati hai. Do zabar lamba <b>aa</b> ban jaate hain. Gol Ta ( ة ) <b>h</b> ban jaati hai. Qalqalah ke harf <b>ق ط ب ج د</b> halki goonj ke saath padhein.",
 body:()=>gt("Stopping")+words([["اَحَدٌ","aḥad","continuing: aḥadun"],["اَبَدًا","abadā","continuing: abadan"],["رَحْمَةٌ","raḥmah","continuing: raḥmatun"],["نَسْتَعِيْنُ","nastaʿīn","continuing: nastaʿīnu"],["اَلْعٰلَمِيْنَ","al-ʿālamīn","continuing: al-ʿālamīna"],["اَلنَّاسِ","an-nās","continuing: an-nāsi"],["مَآءً","māʾā","continuing: māʾan"]])+
 gt("Qalqalah — echo","قُطْبُ جَدٍ")+words([["اَلْفَلَقِ","al-falaq(q)"],["لَمْ يَلِدْ","lam yalid(d)"],["تَبَّ","tabb(b)"],["مُحِيْطٌ","muḥīṭ(ṭ)"],["يَقْطَعُوْنَ","yaqṭaʿūna"],["اَبْتَرُ","abtaru"]])},

{en:"Exercise on Tashdeed Followed by a Tashdeed",tr:"Two Tashdeeds together",ur:"تشدید کے بعد تشدید",sub:"Doubled letters one after another",
 n:"Read each Tashdeed fully: hold the first, then the second. Don't rush through either.",
 h:"Har tashdeed poori padhein: pehli ko rok kar, phir doosri. Kisi ko jaldi mein na nikaalein.",
 body:()=>words([["اِنَّ الَّذِيْنَ","innalladhīna"],["اِنَّ اللّٰهَ","innallāha"],["اِنَّ الصَّفَا","innaṣ-ṣafā"],["ثُمَّ الْجَحِيْمَ","thummal-jaḥīma"],["شَرِّ النَّفّٰثٰتِ","sharrin-naffāthāti"],["اَلرَّحْمٰنِ الرَّحِيْمِ","ar-raḥmānir-raḥīm"],["اُمِّيِّيْنَ","ummiyyīna"],["مِنْ شَرِّ","min sharri"],["رَبِّ النَّاسِ","rabbin-nāsi"],["كُلَّ الَّذِيْ","kullalladhī"]])},

{en:"Madd",tr:"Stretching",ur:"مدّ",sub:"The wavy sign — stretch longer than normal",
 n:"The wavy sign ( ٓ ) on a madd letter means stretch longer than two counts. Before a Hamza in the same word (<b>Muttasil</b>) or the next word (<b>Munfasil</b>), stretch about 4–5 counts. Shown here as āā.",
 h:"Madd ke harf par lehar wala nishaan ( ٓ ) ho to 2 gintee se zyada kheenchein. Usi lafz mein hamza ho (<b>Muttasil</b>) ya agle lafz mein (<b>Munfasil</b>) to lagbhag 4–5 gintee. Yahan aaaa likha hai.",
 body:()=>gt("Madd Muttasil — same word")+words([["جَآءَ","jāāʾa"],["اَلسَّمَآءِ","as-samāāʾi"],["سُوْٓءَ","sūūʾa"],["جِآيْءَ","jīīʾa"],["اُولٰٓئِكَ","ulāāʾika"]])+
 gt("Madd Munfasil — next word")+words([["بِمَآ اُنْزِلَ","bimāā unzila"],["يٰٓاَيُّهَا","yāā ayyuhā"],["قُوْٓا اَنْفُسَكُمْ","qūū anfusakum"],["اِنَّآ اَعْطَيْنٰكَ","innāā aʿṭaynāka"]])},

{en:"Exercise on Tashdeed Followed by the Letters of Madd",tr:"Madd-e-Laazim",ur:"حروفِ مدّ کے بعد تشدید",sub:"Long Madd — stretch for 6 counts",
 n:"When a madd letter is followed by a Tashdeed, stretch it the longest: about six counts.",
 h:"Jab madd ke harf ke baad tashdeed aaye to sabse lamba kheenchein — lagbhag 6 gintee.",
 body:()=>words([["وَلَا الضَّآلِّيْنَ","wa laḍ-ḍāāllīn"],["دَآبَّةٍ","dāābbatin"],["حَآجَّكَ","ḥāājjaka"],["اَلطَّآمَّةُ","aṭ-ṭāāmmatu"],["اَلصَّآخَّةُ","aṣ-ṣāākhkhatu"],["اَلْحَآقَّةُ","al-ḥāāqqatu"],["اَتُحَآجُّوْٓنِّيْ","a-tuḥāājjūūnnī"]])},

{en:"Huroof-e-Muqattaʿaat",tr:"Disjoined letters",ur:"حروفِ مقطعات",sub:"Letters that open certain Surahs",
 n:"These are never read as words. Say each letter's name one after the other, stretching where the wavy sign ( ٓ ) appears.",
 h:"Inhe lafz ki tarah nahi padhte. Har harf ka naam alag alag bolein, aur jahan lehar wala nishaan ( ٓ ) ho wahan kheench kar padhein.",
 body:()=>words([["الٓمّٓ","Alif-Lāāām-Mīīīm"],["الٓمّٓصٓ","Alif-Lāām-Mīīm-Ṣāād"],["الٓرٰ","Alif-Lāām-Rā"],["الٓمّٓرٰ","Alif-Lāām-Mīīm-Rā"],["كٓهٰيٰعٓصٓ","Kāāf-Hā-Yā-ʿAyyn-Ṣāād"],["طٰهٰ","Ṭā-Hā"],["طٰسٓمّٓ","Ṭā-Sīīn-Mīīm"],["طٰسٓ","Ṭā-Sīīn"],["يٰسٓ","Yā-Sīīn"],["صٓ","Ṣāād"],["حٰمٓ","Ḥā-Mīīm"],["عٓسٓقٓ","ʿAyyn-Sīīn-Qāāf"],["قٓ","Qāāf"],["نٓ","Nūūn"]])},

{en:"Laws of Meem Saakin",tr:"Meem with Jazm",ur:"میم ساکن کے قواعد",sub:"Hidden before Ba, merged before Meem, clear otherwise",
 n:"Meem Saakin (مْ) is <b>hidden</b> with ghunnah before Ba, <b>merged</b> with ghunnah before another Meem, and read <b>clearly</b> before every other letter. Meem with Tashdeed ( مّ ) always has ghunnah.",
 h:"Meem Saakin (مْ) Ba se pehle ghunnah ke saath <b>chhupa</b> kar, Meem se pehle <b>mila</b> kar, aur baaki sab harf se pehle <b>saaf</b> padhein. Tashdeed wale Meem ( مّ ) mein hamesha ghunnah hota hai.",
 body:()=>gt("Ikhfaa Shafawi — before ب")+words([["تَرْمِيْهِمْ بِحِجَارَةٍ","tarmīhim bi-ḥijāratin"],["هُمْ بِهٖ","hum bihī"]])+
 gt("Idghaam Shafawi — before م")+words([["لَهُمْ مَّا","lahum-mā"],["كَمْ مِّنْ","kam-min"]])+
 gt("Izhaar Shafawi — all other letters")+words([["اَلَمْ تَرَ","alam tara"],["عَلَيْهِمْ وَلَا","ʿalayhim wa lā"],["لَكُمْ دِيْنُكُمْ","lakum dīnukum"]])+
 gt("Ghunnah — مّ")+words([["ثُمَّ","thumma"],["عَمَّ","ʿamma"],["اَمَّا","ammā"]])},

{en:"Remaining Laws of Noon Saakin & Tanween",tr:"Iqlaab and Ghunnah",ur:"نون ساکن اور تنوین کے باقی قواعد",sub:"n turns into m before Ba; the hum of Noon Mushaddad",
 n:"<b>Iqlaab:</b> before Ba, Noon Saakin or tanween turns into a hidden <b>m</b> with ghunnah (look for the small meem ۢ). <b>Ghunnah:</b> Noon with Tashdeed ( نّ ) is always hummed through the nose for two counts.",
 h:"<b>Iqlaab:</b> Ba se pehle Noon Saakin ya tanween chhupe hue <b>m</b> mein badal jata hai, ghunnah ke saath (chhota meem ۢ dekhein). <b>Ghunnah:</b> tashdeed wala Noon ( نّ ) hamesha naak se 2 gintee gungunaa kar padhein.",
 body:()=>gt("Iqlaab","ب")+words([["مِنْۢ بَعْدِ","mim-baʿdi"],["اَنْۢبِئْهُمْ","ambiʾhum"],["سَمِيْعٌۢ بَصِيْرٌ","samīʿum-baṣīrun"],["لَيُنْۢبَذَنَّ","la-yumbadhanna"]])+
 gt("Ghunnah — نّ")+words([["اِنَّ","inna"],["مِنَ النَّاسِ","minan-nāsi"],["اَلْجَنَّةَ","al-jannata"],["اِنَّآ","innā"]])},

{en:"Idghaam-e-Yarmaloon",tr:"Merging into ي ر م ل و ن",ur:"ادغامِ یرملون",sub:"The n merges into the next letter",
 n:"Before the six letters of <b>يَرْمَلُوْنَ</b>, Noon Saakin and tanween merge into the next letter. With <b>ي ن م و</b> the merge is hummed (with ghunnah); with <b>ل ر</b> there is no hum.",
 h:"<b>يَرْمَلُوْنَ</b> ke chhe harf se pehle Noon Saakin aur tanween agle harf mein mil jaate hain. <b>ي ن م و</b> mein ghunnah ke saath, <b>ل ر</b> mein bina ghunnah.",
 body:()=>gt("With ghunnah","ي ن م و")+words([["مَنْ يَّقُوْلُ","may-yaqūlu"],["مِنْ وَّالٍ","miw-wālin"],["مِنْ مَّالٍ","mim-mālin"],["مِنْ نِّعْمَةٍ","min-niʿmatin"],["خَيْرًا يَّرَهٗ","khayray-yarah"]])+
 gt("Without ghunnah","ل ر")+words([["مِنْ رَّبِّهِمْ","mir-rabbihim"],["مِنْ لَّدُنْهُ","mil-ladunhu"],["غَفُوْرٌ رَّحِيْمٌ","ghafūrur-raḥīmun"],["هُدًى لِّلْمُتَّقِيْنَ","hudal-lil-muttaqīna"]])},

{en:"Rasmul Khat",tr:"Special spellings of the Quran",ur:"رسم الخط",sub:"Letters written but not read, and letters read differently",
 n:"The Quran has some special spellings. A letter with a small circle ( ۠ ) or no mark at all is <b>not read</b>. Waaw in <b>صلٰوة</b> is read as a long ā.",
 h:"Quran mein kuchh khaas imla hai. Jis harf par chhota gol nishaan ( ۠ ) ho ya koi nishaan na ho, wo <b>padha nahi jata</b>. <b>صلٰوة</b> ka Waao lamba aa padha jata hai.",
 body:()=>words([["قَالُوْا","qālū","last alif silent"],["اُولٰٓئِكَ","ulāāʾika","waaw silent"],["اَنَا","ana","last alif silent"],["مِائَةٌ","miʾatun","alif silent"],["لَااَذْبَحَنَّهٗ","la-adhbaḥannahū","first alif silent"],["سَلٰسِلَا۠","salāsila","alif silent"],["بِاَيْىدٍ","bi-aydin","extra ya silent"],["اَلصَّلٰوةَ","aṣ-ṣalāta","waaw read as ā"],["الزَّكٰوةَ","az-zakāta"],["الْحَيٰوةَ","al-ḥayāta"],["اِبْرٰهٖمَ","ibrāhīma"]])},

{en:"Symbols of Waqf",tr:"Stopping signs",ur:"رموزِ اوقاف",sub:"Where to stop and where to keep going",
 n:"These small signs above the line tell you whether to stop, may stop, or must continue.",
 h:"Line ke upar ye chhote nishaan batate hain ki rukna hai, ruk sakte hain, ya aage padhna hai.",
 body:()=>signs([["○","Aayat","End of an ayah — stop"],["مـ","Waqf Laazim","Must stop"],["ط","Waqf Mutlaq","Stop here"],["ج","Waqf Jaa'iz","May stop; stopping is better"],["ز","Waqf Mujawwaz","May stop; continuing is better"],["ص","Waqf Murakhkhas","Continue; stop only if out of breath"],["لا","Laa","Do not stop"],["قف","Qif","Stopping preferred"],["صلے","Al-Waslu Awlaa","Continuing preferred"],["قلے","Al-Waqfu Awlaa","Stopping preferred"],["∴ ∴","Muʿaanaqa","Stop at one of the two, not both"],["س","Saktah","Short pause without taking breath"],["وقفہ","Waqfah","Slightly longer pause, no breath"]])},

{en:"Conclusion: Application of All Rules",tr:"Reading the Quran",ur:"تمام قواعد کا اجرا",sub:"Read real Surahs using everything learned",
 n:"Apply every rule: madd, ghunnah, qalqalah, heavy and light letters, and stopping at the end of each ayah.",
 h:"Saare qaayde lagaayein: madd, ghunnah, qalqalah, mote aur baareek harf, aur har aayat ke aakhir mein rukna.",
 body:()=>gt("Surah al-Fatiha")+ayat([["بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ①","bismillāhir-raḥmānir-raḥīm","In the name of Allah, the Most Gracious, the Most Merciful"],["اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ ②","al-ḥamdu lillāhi rabbil-ʿālamīn","All praise is for Allah, Lord of the worlds"],["الرَّحْمٰنِ الرَّحِيْمِ ③","ar-raḥmānir-raḥīm","The Most Gracious, the Most Merciful"],["مٰلِكِ يَوْمِ الدِّيْنِ ④","māliki yawmid-dīn","Master of the Day of Judgement"],["اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُ ⑤","iyyāka naʿbudu wa iyyāka nastaʿīn","You alone we worship, and You alone we ask for help"],["اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَ ⑥","ihdinaṣ-ṣirāṭal-mustaqīm","Guide us to the straight path"],["صِرَاطَ الَّذِيْنَ اَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّآلِّيْنَ ⑦","ṣirāṭal-ladhīna anʿamta ʿalayhim, ghayril-maghḍūbi ʿalayhim wa laḍ-ḍāāllīn","The path of those You have blessed, not of those who earned anger, nor of those who went astray"]])+
 gt("Surah al-Kawthar")+ayat([["اِنَّآ اَعْطَيْنٰكَ الْكَوْثَرَ ①","innāā aʿṭaynākal-kawthar","Indeed, We have given you al-Kawthar"],["فَصَلِّ لِرَبِّكَ وَانْحَرْ ②","fa-ṣalli li-rabbika wanḥar","So pray to your Lord and sacrifice"],["اِنَّ شَانِئَكَ هُوَ الْاَبْتَرُ ③","inna shāniʾaka huwal-abtar","Indeed, your enemy is the one cut off"]])+
 gt("Surah al-Ikhlas")+ayat([["قُلْ هُوَ اللّٰهُ اَحَدٌ ①","qul huwallāhu aḥad","Say: He is Allah, the One"],["اَللّٰهُ الصَّمَدُ ②","allāhuṣ-ṣamad","Allah, the Eternal Refuge"],["لَمْ يَلِدْ وَلَمْ يُوْلَدْ ③","lam yalid wa lam yūlad","He neither begets nor was born"],["وَلَمْ يَكُنْ لَّهٗ كُفُوًا اَحَدٌ ④","wa lam yakul-lahū kufuwan aḥad","And there is none comparable to Him"]])}
];

