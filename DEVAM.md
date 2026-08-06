# ticket-go.net — Devam / Kayıt

## Son kayıt (geri getir noktası)

| Alan | Değer |
|------|--------|
| Tarih | 2026-08-06 |
| Etiket | `kayit-vitrin` |
| Commit hedefi | `ticket-go.net web sitesi arayüz github` → GitHub `admin-ticket-go/ticket-go-website` |
| Anlam | Kurumsal vitrin yüzü — sefer arama yok |

### Bu kayıtta olanlar

- Üst menü: Ana Sayfa · Hakkımızda · Gizlilik Sözleşmesi · KVKK · İletişim
- Hero slide; İletişim / Hakkımızda butonları yok
- Öne çıkan rota kartları yok
- Avantaj kartlarında SVG ikonlar
- Dijital bilet mockup + sahte QR (demo yazısı yok)
- Sol üst logo büyütüldü (~78px)
- Sticky header (şeffaf → navy)

## «geri getir» komutu

Kullanıcı **geri getir**, **bu kaydı getir** veya **vitrin kaydını geri getir** dediğinde:

1. Kök: `ticket-go.net web sitesi arayüz github` (veya eş kardeş klasör)
2. Çalıştır:

```bash
git checkout kayit-vitrin -- .
# veya tam sıfırlama (yerel değişiklikler silinir — önce sor):
git reset --hard kayit-vitrin
```

3. Kardeş klasöre senkronize et:

```bash
# github → "ticket-go.net web sitesi arayüz"
rsync -a --exclude node_modules --exclude .git --exclude dist ./ "../ticket-go.net web sitesi arayüz/"
```

4. Doğrula: `npm run check`

## Preview

```bash
npm run dev
# http://127.0.0.1:5173/
```

## Not

Yeni anlamlı özellik sonrası bu dosyayı ve `kayit-vitrin` etiketini güncelle (veya `kayit-vitrin-YYYYMMDD` ekle).
