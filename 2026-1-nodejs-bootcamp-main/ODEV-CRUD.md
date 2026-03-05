# Express CRUD Pekistirme Odevi

## Kitap Listesi API

Express.js kullanarak basit bir **Kitap Listesi** uygulamasi yapin.

---

## Klasor Yapisi

```
kitap-listesi/
├── server.js       # Ana sunucu dosyasi
└── books.json      # Kitap verileri
```

---

## 1. books.json Dosyasini Hazirlayin

Asagidaki yapiyi kullanin ve icine **3 kitap** ekleyin:

```json
[
  {
    "id": 1,
    "title": "Suç ve Ceza",
    "author": "Dostoyevski",
    "year": 1866,
    "read": true
  }
]
```

---

## 2. Route'lari Yazin

| Metot  | URL           | Aciklama                        |
|--------|---------------|---------------------------------|
| GET    | /books        | Tum kitaplari listele           |
| GET    | /books/:id    | Tek bir kitabi getir            |
| POST   | /books        | Yeni kitap ekle                 |
| PUT    | /books/:id    | Kitap bilgisini guncelle        |
| DELETE | /books/:id    | Kitabi sil                      |

---

## 3. Detaylar

### GET /books
- `books.json` dosyasini `fs.readFileSync` ile oku
- `JSON.parse` ile cevir
- `res.json()` ile dondur

### GET /books/:id
- `req.params` ile id'yi al
- Dizide `.find()` ile kitabi bul
- Bulunamazsa `res.status(404).json({ message: "Kitap bulunamadi" })`

### POST /books
- `express.json()` middleware'ini unutma
- `req.body` ile yeni kitap verisini al
- Yeni bir `id` olustur (son kitabin id'si + 1)
- Diziyi guncelle ve `fs.writeFileSync` ile dosyaya yaz
- `res.status(201).json()` ile cevap dondur

### PUT /books/:id
- `req.params.id` ile kitabi bul
- `req.body` ile gelen alanlarla guncelle (spread operator kullan)
- Dosyaya kaydet
- Bulunamazsa 404 dondur

### DELETE /books/:id
- `.filter()` ile kitabi diziden cikar
- Dosyaya kaydet
- `res.json({ message: "Kitap silindi" })`

---

## 4. Kontrol Listesi

- [ ] `express.json()` middleware eklendi
- [ ] GET /books calisiyor
- [ ] GET /books/:id calisiyor (bulunamazsa 404)
- [ ] POST /books calisiyor (dosyaya yaziyor)
- [ ] PUT /books/:id calisiyor (dosyaya yaziyor)
- [ ] DELETE /books/:id calisiyor (dosyaya yaziyor)
- [ ] Tum islemlerden sonra books.json guncel kaliyor

---

## Ipuclari

- Dosya yolunu olusturmak icin `path.join(__dirname, "books.json")` kullan
- `fs.readFileSync(path, "utf-8")` unutma
- `fs.writeFileSync(path, JSON.stringify(data, null, 2))` ile guzel formatla
- Postman veya Thunder Client ile test et
- `Number(req.params.id)` ile string'i sayiya cevir

---

## Test Ornekleri (Postman / Thunder Client)

**POST /books**
```json
{
  "title": "1984",
  "author": "George Orwell",
  "year": 1949,
  "read": false
}
```

**PUT /books/1**
```json
{
  "read": true
}
```

**DELETE /books/2**
→ Cevap: `{ "message": "Kitap silindi" }`

---

**Basarilar!**
