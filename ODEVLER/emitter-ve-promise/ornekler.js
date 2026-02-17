// ============================================================
//  EventEmitter ve Promise Yapısı - Açıklamalı Örnekler
// ============================================================

const EventEmitter = require("events");

// ************************************************************
// 1. EVENT EMITTER
// ************************************************************
// EventEmitter, Node.js'in olay tabanlı (event-driven) mimarisinin
// temel yapı taşıdır. Bir olay yayınlanır (emit), dinleyiciler (listeners)
// bu olayı yakalar ve tepki verir.

// --- 1.1 Temel Kullanım ---
console.log("=== 1.1 Temel EventEmitter ===\n");

const emitter = new EventEmitter();

// Olayı dinle
emitter.on("selamla", (isim) => {
  console.log(`Merhaba, ${isim}!`);
});

// Olayı yayınla
emitter.emit("selamla", "Okan");
// Çıktı: Merhaba, Okan!

// --- 1.2 Birden fazla dinleyici ---
console.log("\n=== 1.2 Birden Fazla Dinleyici ===\n");

const siparis = new EventEmitter();

siparis.on("yeniSiparis", (urun) => {
  console.log(`[Mutfak] "${urun}" hazırlanıyor...`);
});

siparis.on("yeniSiparis", (urun) => {
  console.log(`[Kasa] "${urun}" için fatura kesiliyor...`);
});

siparis.on("yeniSiparis", (urun) => {
  console.log(`[Kurye] "${urun}" için teslimat planlanıyor...`);
});

siparis.emit("yeniSiparis", "Pizza");
// Üç dinleyici de sırayla çalışır

// --- 1.3 once() - Sadece bir kere dinle ---
console.log("\n=== 1.3 once() ===\n");

const sunucu = new EventEmitter();

sunucu.once("baslat", () => {
  console.log("Sunucu başlatıldı! (Bu mesaj sadece 1 kez görünür)");
});

sunucu.emit("baslat"); // Çalışır
sunucu.emit("baslat"); // Artık çalışmaz

// --- 1.4 Dinleyiciyi kaldırma ---
console.log("\n=== 1.4 removeListener ===\n");

const log = new EventEmitter();

function logYaz(mesaj) {
  console.log(`[LOG] ${mesaj}`);
}

log.on("mesaj", logYaz);
log.emit("mesaj", "İlk mesaj"); // Çalışır

log.removeListener("mesaj", logYaz);
log.emit("mesaj", "İkinci mesaj"); // Çalışmaz, dinleyici kaldırıldı
console.log("(İkinci mesaj görünmedi çünkü dinleyici kaldırıldı)");

// --- 1.5 Özel sınıf ile EventEmitter ---
console.log("\n=== 1.5 Özel Sınıf ===\n");

class GorevYoneticisi extends EventEmitter {
  constructor() {
    super();
    this.gorevler = [];
  }

  ekle(gorev) {
    this.gorevler.push(gorev);
    this.emit("gorevEklendi", gorev);
  }

  tamamla(index) {
    const gorev = this.gorevler[index];
    this.gorevler.splice(index, 1);
    this.emit("gorevTamamlandi", gorev);
  }
}

const yonetici = new GorevYoneticisi();

yonetici.on("gorevEklendi", (gorev) => {
  console.log(`+ Yeni görev eklendi: "${gorev}"`);
});

yonetici.on("gorevTamamlandi", (gorev) => {
  console.log(`✓ Görev tamamlandı: "${gorev}"`);
});

yonetici.ekle("Node.js öğren");
yonetici.ekle("Proje yap");
yonetici.tamamla(0);

// ************************************************************
// 2. PROMISE
// ************************************************************
// Promise, asenkron işlemleri yönetmek için kullanılır.
// Üç durumu vardır:
//   - pending   : Bekliyor (henüz sonuçlanmadı)
//   - fulfilled : Başarılı (resolve edildi)
//   - rejected  : Başarısız (reject edildi)

console.log("\n=== 2.1 Temel Promise ===\n");

// --- 2.1 Temel Kullanım ---
const basitPromise = new Promise((resolve, reject) => {
  const basarili = true;

  if (basarili) {
    resolve("İşlem başarılı!");
  } else {
    reject("İşlem başarısız!");
  }
});

basitPromise
  .then((sonuc) => console.log(sonuc))
  .catch((hata) => console.log(hata));

// --- 2.2 Asenkron işlem simülasyonu ---
console.log("\n=== 2.2 Asenkron İşlem (setTimeout ile) ===\n");

function veritabanindanKullaniciBul(id) {
  return new Promise((resolve, reject) => {
    console.log(`Kullanıcı #${id} aranıyor...`);

    setTimeout(() => {
      if (id > 0) {
        resolve({ id, isim: "Okan", email: "okan@test.com" });
      } else {
        reject(new Error("Geçersiz kullanıcı ID"));
      }
    }, 1000);
  });
}

veritabanindanKullaniciBul(1)
  .then((kullanici) => console.log("Bulunan kullanıcı:", kullanici))
  .catch((hata) => console.log("Hata:", hata.message));

// --- 2.3 Promise Zinciri (Chaining) ---
// Her .then() yeni bir Promise döner, böylece zincirleme yapılabilir.

function adim1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("\n=== 2.3 Promise Zinciri ===\n");
      console.log("Adım 1: Veri çekiliyor...");
      resolve({ veri: [1, 2, 3] });
    }, 1500);
  });
}

function adim2(oncekiSonuc) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Adım 2: Veri işleniyor...");
      const islenmis = oncekiSonuc.veri.map((x) => x * 10);
      resolve(islenmis);
    }, 500);
  });
}

function adim3(islenmisVeri) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Adım 3: Sonuç kaydediliyor...");
      resolve(`Kaydedilen veri: [${islenmisVeri}]`);
    }, 500);
  });
}

adim1()
  .then((sonuc) => adim2(sonuc))
  .then((sonuc) => adim3(sonuc))
  .then((sonuc) => console.log(sonuc))
  .catch((hata) => console.log("Zincirde hata:", hata.message));

// --- 2.4 async/await ---
// Promise'leri daha okunabilir şekilde yazmak için async/await kullanılır.

async function asyncOrnek() {
  // Önceki zincir örneklerinin bitmesini bekleyelim
  await new Promise((r) => setTimeout(r, 3000));

  console.log("\n=== 2.4 async/await ===\n");

  try {
    const kullanici = await veritabanindanKullaniciBul(5);
    console.log("async/await ile bulunan:", kullanici);
  } catch (hata) {
    console.log("Hata yakalandı:", hata.message);
  }
}

// --- 2.5 Promise.all - Paralel çalıştırma ---
async function parallelOrnek() {
  await new Promise((r) => setTimeout(r, 5000));

  console.log("\n=== 2.5 Promise.all (Paralel) ===\n");

  const islem1 = new Promise((r) =>
    setTimeout(() => r("Dosya yüklendi"), 800)
  );
  const islem2 = new Promise((r) =>
    setTimeout(() => r("Email gönderildi"), 400)
  );
  const islem3 = new Promise((r) =>
    setTimeout(() => r("Log kaydedildi"), 600)
  );

  const sonuclar = await Promise.all([islem1, islem2, islem3]);
  console.log("Tüm işlemler tamamlandı:", sonuclar);
}

// --- 2.6 Promise.race - İlk biten kazanır ---
async function raceOrnek() {
  await new Promise((r) => setTimeout(r, 6500));

  console.log("\n=== 2.6 Promise.race ===\n");

  const hizli = new Promise((r) => setTimeout(() => r("Hızlı sunucu"), 200));
  const yavas = new Promise((r) => setTimeout(() => r("Yavaş sunucu"), 1000));

  const kazanan = await Promise.race([hizli, yavas]);
  console.log("İlk cevap veren:", kazanan);
}

// ************************************************************
// 3. EventEmitter + Promise BİRLİKTE
// ************************************************************

async function birlesikOrnek() {
  await new Promise((r) => setTimeout(r, 8000));

  console.log("\n=== 3. EventEmitter + Promise Birlikte ===\n");

  class DosyaYukleyici extends EventEmitter {
    yukle(dosyaAdi) {
      this.emit("basla", dosyaAdi);

      return new Promise((resolve, reject) => {
        let yuklenen = 0;
        const interval = setInterval(() => {
          yuklenen += 25;
          this.emit("ilerleme", dosyaAdi, yuklenen);

          if (yuklenen >= 100) {
            clearInterval(interval);
            this.emit("bitti", dosyaAdi);
            resolve(`${dosyaAdi} başarıyla yüklendi`);
          }
        }, 300);
      });
    }
  }

  const yukleyici = new DosyaYukleyici();

  yukleyici.on("basla", (dosya) => {
    console.log(`[BAŞLA] ${dosya} yüklenmeye başladı`);
  });

  yukleyici.on("ilerleme", (dosya, yuzde) => {
    console.log(`[İLERLEME] ${dosya}: %${yuzde}`);
  });

  yukleyici.on("bitti", (dosya) => {
    console.log(`[BİTTİ] ${dosya} yükleme tamamlandı!`);
  });

  const sonuc = await yukleyici.yukle("rapor.pdf");
  console.log("\nSonuç:", sonuc);
}

// Tüm async örnekleri çalıştır
asyncOrnek();
parallelOrnek();
raceOrnek();
birlesikOrnek();
