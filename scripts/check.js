/**
 * Temel bütünlük kontrolü (asset yolları, zorunlu dosyalar)
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
let errors = 0;

function fail(msg) {
  console.error("HATA:", msg);
  errors += 1;
}

function ok(msg) {
  console.log("OK:", msg);
}

const required = [
  "index.html",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "package.json",
  "README.md",
  ".gitignore",
  "assets/css/style.css",
  "assets/js/app.js",
  "assets/images/logo.png",
  "assets/images/logo-mark.png",
  "assets/images/favicon.png",
];

for (let i = 1; i <= 6; i += 1) {
  required.push("assets/images/slides/slide-" + i + ".jpg");
}

for (const rel of required) {
  const p = path.join(root, rel);
  if (fs.existsSync(p)) ok(rel);
  else fail("eksik → " + rel);
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const refs = [];
const re = /(?:src|href)="([^"]+)"/g;
let m;
while ((m = re.exec(html))) {
  const ref = m[1];
  if (
    ref.startsWith("http") ||
    ref.startsWith("mailto:") ||
    ref.startsWith("tel:") ||
    ref.startsWith("#") ||
    ref.startsWith("data:")
  ) {
    continue;
  }
  refs.push(ref);
}

for (const ref of refs) {
  const p = path.join(root, ref);
  if (fs.existsSync(p)) ok("ref " + ref);
  else fail("kırık yol → " + ref);
}

if (/fetch\(|localStorage|sessionStorage|document\.cookie/i.test(html)) {
  fail("index.html içinde yasaklı istemci API kullanımı");
}

const js = fs.readFileSync(path.join(root, "assets/js/app.js"), "utf8");
if (/fetch\(|localStorage|sessionStorage|document\.cookie/i.test(js)) {
  fail("app.js içinde yasaklı istemci API kullanımı");
} else {
  ok("app.js — fetch/storage/cookie yok");
}

if (errors) {
  console.error("\nKontrol başarısız:", errors, "hata");
  process.exit(1);
}

console.log("\nTüm kontroller geçti.");
