// Checks run before every build (and on their own with: node scripts/check.mjs).
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

export function runChecks(root) {
  const read = (f) => readFileSync(join(root, "src", f), "utf8");
  const fail = (m) => { console.error("✗ CHECK FAILED: " + m); process.exit(1); };

  // 1. Every script file must parse.
  for (const f of ["lessons.js", "book.js", "tajweed.js", "pwa.js", "app_head.js", "extras.js", "app_body.js", "sw.template.js"]) {
    try { new vm.Script(read(f).replace("__PRECACHE__", "[]"), { filename: f }); } catch (e) { fail(`${f} has a syntax error: ${e.message}`); }
  }

  // 2. Book data: every PDF page 3–41 present, block types known.
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(read("lessons.js") + "\n" + read("book.js") + "\nthis.BOOK=BOOK;this.LESSONS=LESSONS;", ctx);
  const KNOWN = new Set(["H", "T", "U", "F", "N", "K", "A", "A2", "S", "O", "L", "C", "G", "M", "R", "X"]);
  for (let p = 3; p <= 41; p++) {
    const blocks = ctx.BOOK[p];
    if (!Array.isArray(blocks) || !blocks.length) fail(`BOOK[${p}] is missing or empty`);
    blocks.forEach((b, i) => { if (!KNOWN.has(b[0])) fail(`BOOK[${p}] block ${i} has unknown type "${b[0]}"`); });
  }
  if (ctx.LESSONS.length !== 27) fail(`LESSONS should have 27 takhtis, has ${ctx.LESSONS.length}`);

  // 3. Tajweed colouring rules.
  const t = {}; vm.createContext(t); vm.runInContext(read("tajweed.js") + "\nthis.tj=tj;", t);
  const CASES = [["اِنَّ","g"],["ثُمَّ","g"],["اَنْتُمْ","ik"],["مِنْ قَبْلِ","ik"],["مَنْ یَّقُوْلُ","id"],["مِنْ رَّبِّكَ","id"],["مَنْۢ بَخِلَ","iq"],["سَمِیْعٌۢ بَصِیْرٌ","iq"],["لَقَدْ","q"],["یَجْعَلْ","q"],["جَآءَ","m"],["تَرْمِیْهِمْ بِحِجَارَةٍ","ik"],["لَهُمْ مَّا","id"],["نَارًا ذَاتَ","ik"],["غَفُوْرًا رَّحِیْمًا","id"],["كِتٰبٌ فِیْهِ","ik"],["اَلْفَلَقِ","-"],["لَكُمْ دِیْنُكُمْ","-"],["مِنْ هَادٍ","-"],["عَذَابًا الَّذِی","-"],["مِنْهُ خِطَابًا","-"]];
  for (const [s, want] of CASES) {
    const got = [...t.tj(s).matchAll(/<tj-(\w+)>/g)].map((m) => m[1]);
    if (want === "-" ? got.length : !got.includes(want)) fail(`tajweed: "${s}" should be ${want}, got [${got}]`);
  }
  console.log(`✓ Checks passed (39 book pages, 27 takhtis, ${CASES.length} tajweed cases)`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) runChecks(join(dirname(fileURLToPath(import.meta.url)), ".."));
