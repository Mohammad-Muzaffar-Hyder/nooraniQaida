# Noorani Qaida web app

A page-turning, offline-capable web version of the **Noorani Qaida (Indian edition)**, all 27 takhtis.
Each takhti has an explanation page (English + Hinglish), the book's own pages re-typeset as sharp text,
and a 5-question quiz. It adds tajweed colours (Takhti 9+), a Makharij diagram, progress ticks, light/dark themes,
and installs to the home screen on Android and iOS for offline reading.

Deployed on **Vercel** from this Git repo: every push to `main` builds and deploys automatically.

## Golden rule: Quranic and Arabic text must be exact

This is a Quran-reading primer, so a wrong zabar, zer, pesh, jazm, tashdeed or letter is a serious bug.
- Any change to Arabic text in `src/book.js` **must** be checked letter-by-letter and mark-by-mark against
  `source/noorani-qaida-indian-edition.pdf` (kept locally, git-ignored; PDF page = printed page + 2). Zoom into the scan; do not guess.
- Never "fix" Arabic from memory or from another mushaf. The book is the source of truth, even where its
  spelling differs from other prints (e.g. `اِقْرَأْ`, the stopping forms `بُرُوْجْ`, `مُنْهَمِرْ`).
- If a mark is unreadable in the scan, leave it as is and tell the user which page/word needs a human check.
- Recommend that a Qari/Ustad reviews any content change before it goes live.

## Commands

```bash
node scripts/check.mjs     # syntax + data + tajweed rule tests (runs automatically before every build)
node scripts/build.mjs     # builds public/ (what Vercel serves)
npm start                  # build and serve public/ at http://localhost:3000
```
No npm packages are needed. Node 18+.

## Deploy

1. Commit and push to `main` → Vercel runs `node scripts/build.mjs` and publishes `public/`.
2. If `check.mjs` fails, the build fails and the live site stays on the previous version. Read the error.
3. `public/` is generated: never edit it and never commit it (it is in `.gitignore`).
4. The service worker cache version is a hash of all built files, so every content change automatically
   reaches installed/offline users: they see "A new version is ready · Refresh".

## Project layout

```
src/
  shell.html        Page skeleton + ALL CSS (design tokens at the top of <style>; light + dark themes)
  lessons.js        LESSONS[27]: explanation pages (title, Urdu name, How to read EN `n` / Hinglish `h`, examples)
                    plus LETTERS table and helpers (hing(), tile(), words(), triads()...)
  book.js           BOOK[pdfPage] = the Qaida pages, re-typeset as blocks (see format below)
  tajweed.js        tj(text): wraps letters in <tj-g|ik|id|iq|q|m> tags for tajweed colours; TJ_LEGEND
  pwa.js            Install button (Android), Add-to-Home-Screen guide (iOS), service worker registration
  app_head.js       BOOK_PAGES (which PDF pages belong to which takhti), page sequence, cover page
  extras.js         Progress (localStorage "nq-done"), quiz questions (CONCEPT), quiz UI, Makharij page
  app_body.js       Renderers, book-page fitting, two-page spread, page-turn animation, drawer, settings
  sw.template.js    Service worker template (build fills in VERSION and file list)
static/             Copied as-is: fonts (self-hosted woff2 + fonts.css), icons, manifest
scripts/            build.mjs, check.mjs
source/             Reference PDF for proofreading only (git-ignored, never published)
```
Scripts are concatenated in this order (globals flow downward):
`lessons.js → book.js → tajweed.js → pwa.js → app_head.js → extras.js → app_body.js`.

## Editing content

### A Qaida page (`src/book.js`)
`BOOK[p]` is an array of blocks for PDF page `p` (3–41). Block types:

| Block | Meaning |
|---|---|
| `["H", n, "title"]` | Takhti header cartouche (number + Arabic/Urdu title) |
| `["T", "text"]` | Urdu sub-heading |
| `["U", "text"]` / `["F", "text"]` / `["N", "text"]` | Urdu paragraph / footnote / caption |
| `["S", "label"]` | Section label between rules (e.g. مشق، امتحان) |
| `["K", "label"]` | Small label shown at the start of the next `L` line |
| `["A", "..."]` / `["A2", "..."]` | Large / small Arabic line (Bismillah, dua) |
| `["L", "w1 • w2 ۝ w3{قف}"]` | Line of Arabic. `•` = dot separator, `۝` = ayah circle, `*` = star ornament, `{x}` = small waqf sign above the previous word (or above `۝`) |
| `["G", cols, "a|b|c", size]` | Grid of cells, right-to-left; `""` empty cell, `"*"` ornament; `size` scales the letters |
| `["C", "ا ل", flourish, star]` | Circled letters row |
| `["M", cols, [[letter, forms],...]]` | Letter-shape table (Takhti 1) |
| `["R", cols, [[written, read],...]]` | Rasm-ul-Khat table (written form with ۟ + how it is read) |
| `["X", [[sign, meaning],...]]` | Waqf symbols table |
| `["O"]` | Ornament divider |

Helpers at the top of `book.js` (`hg()`, `_R`, `R4`) generate the letter-by-vowel grids.
Pages are drawn at a fixed 600px design width and auto-scaled to fit any screen (`fitBook()` in app_body.js),
so long lines shrink automatically; you do not need to break them by hand.

### An explanation page (`src/lessons.js`)
Each `LESSONS[i]` has `en`, `tr` (transliterated name), `ur`, `sub`, `n` (How to read, English HTML),
`h` (Kaise padhein, Hinglish HTML) and `body()` built from `tile()`, `words([[arabic, english, hint]])`,
`triads()`, `gt()` (group title). The Hinglish line under each item is generated from the English one by `hing()`:
use the transliteration key (ā ī ū, ḥ ṣ ḍ ṭ ẓ, ʿ ʾ) in English and Hinglish follows automatically.

### Quizzes (`src/extras.js`)
`CONCEPT[n] = [question, [correctAnswer, wrong1, wrong2, wrong3], arabicOptions?]`.
**The first option is always the correct one**; options are shuffled when shown. The other four questions are
generated from the takhti's own explanation-page examples. 4/5 correct ticks the takhti as done.

### Tajweed colours (`src/tajweed.js`)
Applied only to book pages from PDF page 23 (Takhti 9) onward. Rules: ghunnah (نّ مّ), ikhfa & ikhfa shafawi,
idgham & idgham shafawi, iqlab (ۢ or ن/tanween before ب), qalqalah (ق ط ب ج د with jazm), madd (ٓ / آ).
If you change a rule, add a test case to `CASES` in `scripts/check.mjs`.

## Design rules
- All colours are CSS tokens in `shell.html` with light and dark values; never hard-code a colour in a component.
- Fonts are self-hosted (Scheherazade New for Arabic, Noto Nastaliq Urdu, Young Serif, Figtree, Amiri). Do not add
  Google Fonts or any other CDN: the app must work fully offline. New static files under `static/` are precached
  automatically.
- The book opens right-to-left: "Next" is on the left, swipe right to go forward, ← arrow key = next page.
- Must work from 320px phones to 4K monitors (single page below ~640px or short screens, two-page spread above).

## Verify before pushing
1. `node scripts/check.mjs` passes.
2. `npm start`, then open http://localhost:3000 on a phone-sized and a desktop window, light and dark theme,
   and look at every page you changed. For Arabic changes, compare side by side with the PDF page.
3. Offline: load once, then in DevTools → Network tick "Offline" and reload; the Qaida should still open.

## Credit
The last page shows "Developed by m2hxa". Keep it (`render()` → end page in app_body.js).
