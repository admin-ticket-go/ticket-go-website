# Gizlilik Politikası sayfası — teslim raporu

**Tarih:** 2026-11-21
**Repo:** `/Users/ticket-go/Desktop/Ticket-Go-Website` (`admin-ticket-go/ticket-go-website`)
**Hedef URL:** `https://www.ticket-go.net/gizlilik-politikasi`

## Teslim alanları

```
PRIVACY_PAGE_CREATED=PASS (yerel: gizlilik-politikasi.html + dist/)
PRIVACY_CONTENT_VERIFIED=PASS (doğrulanmış kurumsal iletişim + Android davranışlarıyla hizalı; uydurma saklama süresi yok)
LOCAL_BUILD=PASS (npm run check && npm run build)
MOBILE_RESPONSIVE=PASS (legal-page CSS + mevcut site breakpoint’leri; yerel önizleme)
HTTPS_STATUS=PASS (canlı site zaten HTTPS; yeni path dağıtılmadı)
PUBLIC_URL=https://www.ticket-go.net/gizlilik-politikasi
DEPLOY_STATUS=NOT_STARTED
GOOGLE_PLAY_PRIVACY_READY=NOT_READY (canlı URL henüz 403/yok; dağıtım sonrası doğrulanmalı)
REMAINING_BLOCKERS=dist/ veya kök statik dosyaları sunucuya (/var/www/ticketgo-website/out) yükle + canlı URL 200 doğrula + Play Console privacy URL alanını güncelle
```

## Değiştirilen dosyalar

| Dosya | Değişiklik |
|---|---|
| `gizlilik-politikasi.html` | **Yeni** bağımsız gizlilik sayfası |
| `index.html` | Footer → `/gizlilik-politikasi`; `#gizlilik` paneline tam sayfa notu + güncel URL |
| `assets/css/style.css` | `.legal-page*` stilleri |
| `scripts/build.js` | Yeni HTML’i `dist/`’e kopyala |
| `scripts/check.js` | Sayfa/zorunlu içerik kontrolleri |
| `sitemap.xml` | Ana sayfa + gizlilik URL |
| `docs/PRIVACY_PAGE_DELIVERY.md` | Bu rapor |

## Yerel doğrulama

```bash
cd /Users/ticket-go/Desktop/Ticket-Go-Website
npm run check   # PASS
npm run build   # → dist/
npm run preview # http://127.0.0.1:4173/gizlilik-politikasi → 200
```

- `/gizlilik-politikasi` doğrudan açılıyor (serve + nginx `$uri.html` uyumlu).
- Yenilemede 404 yok (yerel).
- `#gizlilik` paneli korunuyor.
- Android / backend / ödeme kodu değişmedi.

## Canlı dağıtım adımları (yapılmadı — push yok)

1. `npm run check && npm run build`
2. `dist/` içeriğini sunucudaki `/var/www/ticketgo-website/out` (veya mevcut web root) altına kopyala.
3. Nginx `try_files $uri $uri.html $uri/ =404;` zaten `/gizlilik-politikasi` → `gizlilik-politikasi.html` çözümler.
4. Doğrula:
   - `curl -sI https://www.ticket-go.net/gizlilik-politikasi` → 200
   - Sayfada “Ticket-Go Gizlilik Politikası” ve kanonik URL görünür
5. Play Console Privacy policy URL = `https://www.ticket-go.net/gizlilik-politikasi`
6. (İsteğe bağlı) Android `ticketgo-legal-tr.json` `sourceURL` alanını aynı URL’ye güncelle — bu turda Android değiştirilmedi.

## Canlı kontrol (dağıtım öncesi)

`https://www.ticket-go.net/gizlilik-politikasi` şu an **ana sayfa HTML’sini** döndürüyor
(title: “Deniz Yolculuğunun Dijital Bilet Platformu”, aynı `index.html` boyutu).
Yeni `gizlilik-politikasi.html` sunucuya yüklenmediği için Play URL’si **PASS sayılmadı**.

Dağıtımdan sonra beklenen kanıt: title `Ticket-Go Gizlilik Politikası` + canonical
`https://www.ticket-go.net/gizlilik-politikasi`.
