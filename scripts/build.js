/**
 * Statik site production kopyası → dist/
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");

const COPY_FILES = [
  "index.html",
  "gizlilik-politikasi.html",
  "hesap-silme.html",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
];
const COPY_DIRS = ["assets"];

function rmDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else copyFile(from, to);
  }
}

rmDir(dist);
fs.mkdirSync(dist, { recursive: true });

for (const file of COPY_FILES) {
  const src = path.join(root, file);
  if (!fs.existsSync(src)) {
    console.error("Eksik dosya:", file);
    process.exit(1);
  }
  copyFile(src, path.join(dist, file));
}

for (const dir of COPY_DIRS) {
  const src = path.join(root, dir);
  if (!fs.existsSync(src)) {
    console.error("Eksik klasör:", dir);
    process.exit(1);
  }
  copyDir(src, path.join(dist, dir));
}

console.log("Build tamamlandı → dist/");
console.log("Önizleme: npm run preview");
