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
  "gizlilik-politikasi.html",
  "hesap-silme.html",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "package.json",
  "README.md",
  ".gitignore",
  "assets/css/style.css",
  "assets/js/app.js",
  "assets/js/site-content.js",
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

function collectLocalRefs(html) {
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
      ref.startsWith("/") ||
      ref.startsWith("data:")
    ) {
      continue;
    }
    refs.push(ref);
  }
  return refs;
}

const htmlFiles = ["index.html", "gizlilik-politikasi.html", "hesap-silme.html"];
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  for (const ref of collectLocalRefs(html)) {
    const p = path.join(root, ref);
    if (fs.existsSync(p)) ok(file + " ref " + ref);
    else fail(file + " kırık yol → " + ref);
  }
  if (/fetch\(|localStorage|sessionStorage|document\.cookie/i.test(html)) {
    fail(file + " içinde yasaklı istemci API kullanımı");
  } else {
    ok(file + " — fetch/storage/cookie yok");
  }
}

const privacy = fs.readFileSync(path.join(root, "gizlilik-politikasi.html"), "utf8");
const privacyNeedles = [
  "Ticket-Go Gizlilik Politikası",
  "TicketGo Teknoloji A.Ş.",
  "iyzico",
  "MRZ",
  "kvkk@ticket-go.net",
  "https://www.ticket-go.net/gizlilik-politikasi",
  'rel="canonical"',
];
for (const needle of privacyNeedles) {
  if (privacy.includes(needle)) ok("privacy içerik → " + needle);
  else fail("privacy eksik → " + needle);
}

const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (indexHtml.includes('href="/gizlilik-politikasi"')) ok("footer/index gizlilik linki");
else fail("index.html gizlilik-politikasi linki yok");
if (indexHtml.includes('href="/hesap-silme"')) ok("footer/index hesap silme linki");
else fail("index.html hesap-silme linki yok");
if (indexHtml.includes('id="gizlilik"')) ok("#gizlilik paneli korunuyor");
else fail("#gizlilik paneli eksik");

const deletion = fs.readFileSync(path.join(root, "hesap-silme.html"), "utf8");
const deletionNeedles = [
  "Ticket-Go Hesap Silme Talebi",
  "Hesap Silme Talebi Oluştur",
  "destek@ticket-go.net",
  "mailto:destek@ticket-go.net?subject=Ticket-Go%20Hesap%20Silme%20Talebi",
  'href="/gizlilik-politikasi"',
  "https://www.ticket-go.net/hesap-silme",
  'rel="canonical"',
];
for (const needle of deletionNeedles) {
  if (deletion.includes(needle)) ok("hesap-silme içerik → " + needle);
  else fail("hesap-silme eksik → " + needle);
}
if (/info@ticket-go\.net|kvkk@ticket-go\.net/i.test(deletion)) {
  fail("hesap-silme doğrulanmamış posta kutusu kullanıyor");
} else {
  ok("hesap-silme — yalnızca destek@ticket-go.net");
}
if (/<form\b|<input\b|<textarea\b/i.test(deletion)) {
  fail("hesap-silme form alanı içeriyor");
} else {
  ok("hesap-silme — giriş formu yok");
}
if (!/düğmeye tıklamak/i.test(deletion)) {
  fail("hesap-silme mailto uyarısı eksik");
} else {
  ok("hesap-silme — mailto gönderim sayılmaz");
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
if (sitemap.includes("https://www.ticket-go.net/hesap-silme")) ok("sitemap hesap-silme");
else fail("sitemap hesap-silme yok");

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
