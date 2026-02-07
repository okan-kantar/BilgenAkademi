# Node.js Bootcamp - 2. Hafta Ödevi

## Film Arşivi Yönetim Sistemi

Tüm öğrendiğiniz konuları kullanarak bir **Film Arşivi Web Uygulaması** geliştirin.

---

## Proje Gereksinimleri

### 1. Modül Yapısı

Projeyi aşağıdaki modüllere ayırın:

```
film-arsivi/
├── server.js           # Ana sunucu dosyası
├── modules/
│   ├── fileManager.js  # Dosya işlemleri (CommonJS)
│   ├── logger.mjs      # Log sistemi (ES Module)
│   └── eventBus.js     # Event yönetimi (CommonJS)
├── data/
│   ├── films.json      # Film verileri
│   └── categories.json # Kategori verileri
├── logs/
│   └── app.log         # Uygulama logları
├── templates/
│   ├── home.html
│   ├── films.html
│   ├── film-detail.html
│   └── 404.html
└── reports/
    └── (oluşturulan raporlar)
```

---

### 2. Kullanılması Gereken Konular

#### CommonJS Modül Sistemi
- `fileManager.js` modülünde `module.exports` kullanın
- JSON dosyalarını okuma/yazma fonksiyonları içersin

#### ES Modules
- `logger.mjs` dosyasını ES Module olarak yazın (`export/import`)
- Farklı log seviyeleri olsun: `info`, `warn`, `error`

#### JSON ile Çalışma
- `films.json` içinde film verileri tutun:
```json
{
  "films": [
    {
      "id": 1,
      "title": "Inception",
      "year": 2010,
      "director": "Christopher Nolan",
      "category": "sci-fi",
      "rating": 8.8,
      "watched": true
    }
  ]
}
```
- En az 5 film ekleyin

#### Path Modülü
- Tüm dosya yollarını `path.join()` ile oluşturun
- Dinamik olarak template ve data klasörlerine erişin

#### Events Modülü
- `eventBus.js` içinde EventEmitter kullanın
- Şu eventleri tanımlayın:
  - `filmViewed` - Bir film detayına bakıldığında
  - `filmAdded` - Yeni film eklendiğinde
  - `reportGenerated` - Rapor oluşturulduğunda
- Her event tetiklendiğinde log dosyasına yazın

#### File System (fs) Modülü
- **Promise API** kullanın (`fs/promises`)
- JSON dosyalarını okuyun ve güncelleyin
- Log dosyasına kayıt ekleyin
- async/await kullanın

#### Streams
- `/reports/export` route'unda tüm filmleri bir text dosyasına stream ile yazın
- Büyük veri simülasyonu için her filmi ayrı satıra yazın

#### HTTP Server
- Port 3000'de çalışan bir server oluşturun
- Request ve response objelerini kullanın

#### Routing
Şu route'ları destekleyin:

| URL | Açıklama |
|-----|----------|
| `GET /` | Ana sayfa - Hoş geldin mesajı ve istatistikler |
| `GET /films` | Tüm filmlerin listesi |
| `GET /films/:id` | Film detay sayfası |
| `GET /films/category/:name` | Kategoriye göre filmler |
| `GET /api/films` | JSON formatında tüm filmler |
| `GET /api/stats` | JSON formatında istatistikler |
| `GET /reports/export` | Film listesini dosyaya aktar |

#### HTML Template
- Template dosyalarında placeholder kullanın:
  - `{{title}}` - Sayfa başlığı
  - `{{content}}` - Dinamik içerik
  - `{{filmList}}` - Film kartları
  - `{{stats}}` - İstatistikler
- CSS ile basit stil verin (inline veya `<style>` etiketi)

---

### 3. Özellikler

#### Ana Sayfa (`/`)
- Hoş geldin mesajı
- Toplam film sayısı
- İzlenen/izlenmeyen film sayısı
- Ortalama puan
- Son eklenen 3 film

#### Film Listesi (`/films`)
- Tüm filmleri kart şeklinde göster
- Her kartta: poster placeholder, başlık, yıl, puan
- Detay sayfasına link

#### Film Detay (`/films/:id`)
- Filmin tüm bilgileri
- Yönetmen, kategori, yıl, puan
- İzlenme durumu
- Bu sayfaya her girildiğinde `filmViewed` eventi tetiklensin

#### API Endpoints
- `/api/films` - Tüm filmler (JSON)
- `/api/stats` - İstatistikler (JSON):
```json
{
  "totalFilms": 10,
  "watchedFilms": 7,
  "averageRating": 7.8,
  "categories": {
    "sci-fi": 3,
    "drama": 4,
    "action": 3
  }
}
```

#### Rapor Oluşturma (`/reports/export`)
- Stream kullanarak `reports/films-export.txt` dosyası oluşturun
- Her film için bir satır yazın
- Tamamlandığında `reportGenerated` eventi tetiklensin
- Kullanıcıya "Rapor oluşturuldu" mesajı gösterin

#### Loglama
- Her request loglanmalı: `[tarih] METHOD /url`
- Event'ler loglanmalı: `[tarih] EVENT: filmViewed - Film: Inception`
- Hatalar loglanmalı: `[tarih] ERROR: Dosya bulunamadı`

---

### 4. Örnek Ekran Çıktıları

**Ana Sayfa:**
```
╔════════════════════════════════════╗
║     🎬 Film Arşivi Yönetimi       ║
╠════════════════════════════════════╣
║  Toplam Film: 10                   ║
║  İzlenen: 7 | İzlenmeyen: 3        ║
║  Ortalama Puan: ⭐ 7.8             ║
╠════════════════════════════════════╣
║  Son Eklenenler:                   ║
║  • Oppenheimer (2023)              ║
║  • Dune: Part Two (2024)           ║
║  • The Batman (2022)               ║
╚════════════════════════════════════╝
```

**Konsol Logları:**
```
[2026-01-25 14:30:22] INFO: Server started on port 3000
[2026-01-25 14:30:25] INFO: GET /
[2026-01-25 14:30:28] INFO: GET /films
[2026-01-25 14:30:30] INFO: GET /films/1
[2026-01-25 14:30:30] EVENT: filmViewed - Film: Inception
[2026-01-25 14:31:00] INFO: GET /reports/export
[2026-01-25 14:31:00] EVENT: reportGenerated - File: films-export.txt
```

**Export Dosyası (reports/films-export.txt):**
```
=== Film Arşivi Raporu ===
Oluşturulma: 2026-01-25 14:31:00
Toplam: 10 film
================================

1. Inception (2010)
   Yönetmen: Christopher Nolan
   Kategori: Sci-Fi | Puan: 8.8
   Durum: ✓ İzlendi

2. The Dark Knight (2008)
   Yönetmen: Christopher Nolan
   Kategori: Action | Puan: 9.0
   Durum: ✓ İzlendi

...
```

---

### 5. Bonus Özellikler (Opsiyonel)

- [ ] Film arama özelliği (`/search?q=batman`)
- [ ] Puana göre sıralama (`/films?sort=rating`)
- [ ] Favori filmleri işaretleme
- [ ] Basit CSS animasyonları
- [ ] Watch modu ile geliştirme (`node --watch server.js`)

---

## Kontrol Listesi

Teslim etmeden önce şunları kontrol edin:

- [ ] CommonJS modül kullanıldı (`require/module.exports`)
- [ ] ES Module kullanıldı (`.mjs` dosyası, `import/export`)
- [ ] JSON dosyaları okunuyor ve kullanılıyor
- [ ] Path modülü ile dosya yolları oluşturuluyor
- [ ] EventEmitter ile event sistemi kuruldu
- [ ] FS Promise API kullanıldı (`async/await`)
- [ ] Stream ile dosyaya yazma yapıldı
- [ ] HTTP Server çalışıyor
- [ ] En az 5 farklı route tanımlı
- [ ] HTML template'ler dinamik içerik gösteriyor
- [ ] Log dosyasına kayıt yapılıyor
- [ ] Hata yönetimi yapıldı (404, try-catch)

---

## Başlangıç İpuçları

1. Önce klasör yapısını oluşturun
2. JSON dosyalarını hazırlayın
3. Modülleri tek tek yazın ve test edin
4. Server'ı en son entegre edin
5. Her adımda `console.log` ile debug yapın

---

**Başarılar!**
