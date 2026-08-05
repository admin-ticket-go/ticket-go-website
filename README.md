# Ticket-Go — Kurumsal Web Sitesi Arayüzü

**Proje adı:** ticket-go.net web sitesi arayüz  
**Domain:** https://ticket-go.net  
**Şirket:** ticketgo.net Teknoloji A.Ş.

## Projenin amacı

Ticket-Go markasının kurumsal tanıtım sitesidir. Feribot / deniz ulaşımı teknolojisi hakkında bilgilendirme; iletişim, gizlilik ve KVKK metinlerini sunar.

Bu depo **yalnızca arayüz** içerir. Backend API, üyelik, ödeme formu, analytics veya çerez takibi yoktur.

## Kullanılan teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Markup | HTML5 (tek sayfa) |
| Stil | CSS3 (vanilla, responsive) |
| Davranış | Vanilla JavaScript (ES5 uyumlu IIFE) |
| Çalıştırma | Node.js ≥ 18 + `serve` (devDependency) |
| Framework | **Yok** — React / Next.js / Vue / Vite kullanılmaz |

## Kurulum adımları

```bash
cd "/Users/ticket-go/Desktop/ticket-go.net web sitesi arayüz github"
npm install
```

## Geliştirme ortamında çalıştırma

```bash
npm run dev
```

Tarayıcı: http://127.0.0.1:5173/

Alternatif (Node olmadan):

```bash
python3 -m http.server 8080
```

## Production build

```bash
npm run build
```

Çıktı: `dist/` (statik dosya kopyası)

Önizleme:

```bash
npm run preview
```

Bütünlük kontrolü:

```bash
npm run check
```

## Klasör yapısı

```text
.
├── index.html              # Ana sayfa
├── favicon.ico
├── robots.txt
├── sitemap.xml
├── package.json
├── .gitignore
├── .env.example
├── README.md
├── scripts/
│   ├── build.js            # dist/ üretim
│   └── check.js            # asset / yol kontrolü
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── app.js
    └── images/
        ├── logo.png
        ├── logo-mark.png
        ├── favicon.png
        ├── hero-ticket-go.jpg
        └── slides/
            ├── slide-1.jpg … slide-6.jpg
```

## Ortam değişkenleri

Bu proje statiktir; zorunlu ortam değişkeni yoktur.  
Detay: `.env.example`

`.env` dosyası Git’e eklenmez (`.gitignore`).

## Sayfa akışı

1. Sticky header — premium 3D logo, menü, İletişim (yeşil nabız)
2. Hero — kurumsal başlık + yatay görsel geçişi (otomatik + nokta/ok kontrol)
3. Footer — logo, kurumsal / yasal / iletişim

Hakkımızda, İletişim, Gizlilik ve KVKK içerikleri üst bilgi kartında (dialog) açılır.

**Kullanılmayanlar:** yan slider, dikey slider, side/vertical carousel yok.

## Deploy bilgileri

`dist/` veya kökteki statik dosyalar herhangi bir statik hosta yüklenebilir:

- Nginx / Apache
- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel (static)

Yayın öncesi:

1. `npm run check && npm run build`
2. `robots.txt` / `sitemap.xml` / canonical (`https://ticket-go.net/`) doğrulaması
3. Gizlilik ve KVKK metinlerinin hukuki kontrolü

### GitHub’a yükleme

```bash
cd "/Users/ticket-go/Desktop/ticket-go.net web sitesi arayüz github"
git push -u origin main
```

Uzak depo: `https://github.com/admin-ticket-go/ticket-go-website.git`

## Lisans

Kaynak kod ve içerik ticketgo.net Teknoloji A.Ş. mülkiyetindedir.  
İzinsiz kopyalama / yeniden yayınlama yasaktır.
