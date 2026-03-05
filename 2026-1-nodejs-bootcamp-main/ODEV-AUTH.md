# Express Auth Pekistirme Odevi

## Not Defteri API (Kimlik Dogrulamali)

Ogrendigimiz **MVC yapisi**, **CORS**, **Middleware**, **JWT** ve **bcryptjs** konularini kullanarak basit bir **Not Defteri API** yapin.

---

## Klasor Yapisi

```
not-defteri/
├── server.js
├── .env
├── config/
│   └── corsConfig.js
├── routes/
│   ├── authRoutes.js
│   └── noteRoutes.js
├── controllers/
│   ├── authController.js
│   └── noteController.js
├── middleware/
│   ├── auth.js
│   └── logEvents.js
├── models/
│   ├── users.json
│   ├── notes.json
│   └── refreshTokens.json
└── logs/
    └── reqLog.log
```

---

## 1. Baslangic Verileri

**models/users.json**
```json
[]
```

**models/notes.json**
```json
[]
```

**models/refreshTokens.json**
```json
[]
```

**.env**
```
PORT=3000
JWT_ACCESS_SECRET=notdefteriaccess123
JWT_REFRESH_SECRET=notdefterirefresh456
```

---

## 2. Yapilacaklar

### A) server.js - Ana Dosya

- Express uygulamasini olustur
- Middleware sirasi:
  1. CORS (corsConfig kullan)
  2. Request logger (logEvents)
  3. `express.json()`
  4. `express.urlencoded({ extended: false })`
  5. Route'lar
- `dotenv` ile .env dosyasini yukle
- `process.env.PORT` ile portu al

### B) CORS Ayarlari (config/corsConfig.js)

- Bir whitelist dizisi olustur: `["http://localhost:3000", "http://localhost:5173"]`
- Sadece whitelist'teki origin'lere izin ver
- `module.exports` ile export et

### C) Request Logger Middleware (middleware/logEvents.js)

- Her gelen istegi logla: `[tarih] METHOD /url`
- `logs/reqLog.log` dosyasina `fs.appendFile` ile yaz
- `next()` cagirmayi unutma

### D) Auth Islemleri

#### Register - POST /api/auth/register

`req.body` ile al:
```json
{
  "username": "ali",
  "email": "ali@mail.com",
  "password": "123456"
}
```

Yapilacaklar:
1. Email daha once kayitli mi kontrol et
2. `bcryptjs.genSalt(10)` ile salt olustur
3. `bcryptjs.hash(password, salt)` ile sifreyi hashle
4. Kullaniciyi `users.json` dosyasina kaydet (id icin `Date.now()` kullan)
5. Cevaptaki kullanici objesinde **sifre olmamali**

#### Login - POST /api/auth/login

`req.body` ile al:
```json
{
  "email": "ali@mail.com",
  "password": "123456"
}
```

Yapilacaklar:
1. Email ile kullaniciyi bul
2. `bcryptjs.compare(password, user.password)` ile kontrol et
3. Dogru ise **iki token** olustur:
   ```js
   // Access Token - kisa sureli (15 dakika)
   const accessToken = jwt.sign(
     { id: user.id, email: user.email },
     process.env.JWT_ACCESS_SECRET,
     { expiresIn: "15m" }
   );

   // Refresh Token - uzun sureli (7 gun)
   const refreshToken = jwt.sign(
     { id: user.id },
     process.env.JWT_REFRESH_SECRET,
     { expiresIn: "7d" }
   );
   ```
4. Refresh token'i `refreshTokens.json` dosyasina kaydet (userId ile birlikte)
5. Her iki token'i ve kullanici bilgisini (sifresiz) dondur

#### Refresh Token - POST /api/auth/refresh-token

`req.body` ile al:
```json
{
  "refreshToken": "eski-refresh-token-degeri"
}
```

Yapilacaklar:
1. Gelen refresh token `refreshTokens.json` icinde var mi kontrol et
2. Yoksa `403` dondur
3. `jwt.verify()` ile refresh token'i dogrula
4. Eski refresh token'i `refreshTokens.json` dan sil
5. Yeni access token ve yeni refresh token olustur
6. Yeni refresh token'i `refreshTokens.json` a kaydet
7. Her iki yeni token'i dondur

### E) Auth Middleware (middleware/auth.js)

**verifyAccessToken:**
- `Authorization` header'dan Bearer token'i al
- `jwt.verify()` ile `JWT_ACCESS_SECRET` kullanarak dogrula
- Gecerli ise `req.user = decoded` yap ve `next()` cagir
- Gecersiz ise `401` dondur

### F) Not Islemleri (Korumali Route'lar)

**Tum not route'lari `auth` middleware'inden gecmeli!**

| Metot  | URL         | Aciklama            |
|--------|-------------|---------------------|
| GET    | /api/notes  | Tum notlari getir   |
| POST   | /api/notes  | Yeni not ekle       |
| DELETE | /api/notes/:id | Notu sil         |

#### GET /api/notes
- `notes.json` dosyasini oku ve dondur

#### POST /api/notes
```json
{
  "title": "Alisveris Listesi",
  "content": "Sut, ekmek, yumurta"
}
```
- `req.user.id` ile kimin notu oldugunu kaydet
- `notes.json` dosyasina yaz

#### DELETE /api/notes/:id
- `req.params.id` ile notu bul ve sil
- `notes.json` dosyasini guncelle

---

## 3. Route Dosyalari

**routes/authRoutes.js**
```js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
```

**routes/noteRoutes.js**
```js
const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");
const { verifyAccessToken } = require("../middleware/auth");

router.get("/", verifyAccessToken, noteController.getAllNotes);
router.post("/", verifyAccessToken, noteController.createNote);
router.delete("/:id", verifyAccessToken, noteController.deleteNote);

module.exports = router;
```

**server.js icinde:**
```js
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
```

---

## 4. Test Sirasi (Postman / Thunder Client)

1. **Register** → POST `http://localhost:3000/api/auth/register`
2. **Login** → POST `http://localhost:3000/api/auth/login` → accessToken ve refreshToken doner
3. **Not Ekle** → POST `http://localhost:3000/api/notes`
   - Header: `Authorization: Bearer <accessToken>`
4. **Notlari Getir** → GET `http://localhost:3000/api/notes`
   - Header: `Authorization: Bearer <accessToken>`
5. **Not Sil** → DELETE `http://localhost:3000/api/notes/1`
   - Header: `Authorization: Bearer <accessToken>`
6. **Token olmadan dene** → 401 hatasi almali
7. **Refresh Token** → POST `http://localhost:3000/api/auth/refresh-token`
   - Body: `{ "refreshToken": "<eski-refreshToken>" }`
   - Yeni accessToken ve refreshToken donmeli

---

## 5. Kontrol Listesi

- [ ] MVC klasor yapisi olusturuldu
- [ ] .env dosyasi ve dotenv kullanildi
- [ ] CORS whitelist ayarlandi
- [ ] Request logger middleware calisiyor (reqLog.log'a yaziyor)
- [ ] Register calisiyor (sifre hashleniyor)
- [ ] Login calisiyor (accessToken ve refreshToken donuyor)
- [ ] Refresh token refreshTokens.json dosyasina kaydediliyor
- [ ] POST /api/auth/refresh-token calisiyor (yeni token cifti donuyor)
- [ ] Auth middleware accessToken dogruluyor
- [ ] GET /api/notes calisiyor (token gerekli)
- [ ] POST /api/notes calisiyor (token gerekli)
- [ ] DELETE /api/notes/:id calisiyor (token gerekli)
- [ ] Token olmadan istek atinca 401 donuyor

---

## Gerekli Paketler

```bash
npm init -y
npm install express bcryptjs jsonwebtoken dotenv cors
npm install -D nodemon
```

---

**Basarilar!**
