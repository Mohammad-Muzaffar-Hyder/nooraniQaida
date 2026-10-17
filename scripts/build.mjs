// Build: src/ + static/ → public/   (no npm packages needed; Node 18+)
// Run:   node scripts/build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { runChecks } from "./check.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (f) => readFileSync(join(root, "src", f), "utf8");
const out = join(root, "public");

// 1. Checks first: syntax + tajweed rules + data sanity. A failing check stops the deploy.
runChecks(root);

// 2. Script files, in load order (later files use globals from earlier ones).
const JS_ORDER = ["lessons.js", "book.js", "tajweed.js", "pwa.js", "app_head.js", "extras.js", "app_body.js"];
const js = JS_ORDER.map((f) => `/* ===== ${f} ===== */\n` + src(f)).join("\n");

// 3. Page shell → full HTML document with self-hosted fonts, manifest and iOS tags.
let shell = src("shell.html");
shell = shell.replace(/<link rel="preconnect"[^>]*>\n?/g, "");
shell = shell.replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^"]*">/, '<link rel="stylesheet" href="fonts.css">');
shell = shell.replace(/^<meta charset="utf-8">\n?/, "");
const titleEnd = shell.indexOf("</title>") + "</title>".length;
const head = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Noorani Qaida (Indian edition): all 27 takhtis with English and Hinglish reading help, quizzes and tajweed colours. Works offline.">
<meta name="theme-color" content="#0C4434">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" href="icons/favicon-64.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Noorani Qaida">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
`;
shell = head + shell.slice(0, titleEnd) + shell.slice(titleEnd);
shell = shell.replace("</style>", "</style>\n</head>\n<body>");
shell = shell.replace("*{box-sizing:border-box}", "*{box-sizing:border-box}\nhtml{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}\nbody{margin:0}");
const html = shell + `\n<script>\n${js}\n</script>\n</body>\n</html>\n`;

// 4. Write public/
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, "static"), out, { recursive: true });
writeFileSync(join(out, "index.html"), html);

// 5. Service worker: precache every file; cache name changes whenever any file changes.
const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(relative(out, p).split("\\").join("/")); } })(out);
const hash = createHash("sha256");
for (const f of files.sort()) hash.update(f).update(readFileSync(join(out, f)));
const version = hash.digest("hex").slice(0, 12);
const precache = ["./", ...files.filter((f) => f !== "sw.js")];
const sw = src("sw.template.js").replace("__VERSION__", version).replace("__PRECACHE__", JSON.stringify(precache, null, 0));
writeFileSync(join(out, "sw.js"), sw);

console.log(`Built public/ — ${files.length + 1} files, version ${version}`);
