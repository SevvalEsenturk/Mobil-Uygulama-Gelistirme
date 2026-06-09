# 🔒 Kilit (LockApp) - Mobil Uygulama Geliştirme

Kilit (LockApp), ebeveynlerin çocuklarının dijital alışkanlıklarını yönetmelerine ve uygulama kullanım sürelerini takip etmelerine olanak tanıyan kapsamlı bir mobil denetim sistemidir.

---

## 🎥 Proje Tanıtım Videosu
Projemizin detaylı tanıtım ve çalışma videosuna aşağıdaki Google Drive bağlantısı üzerinden ulaşabilirsiniz:
👉 **[Google Drive Proje Videosu](https://drive.google.com/drive/folders/1GXyRsrjSXPJRjFvbG3gP9ahd_66KlML9?usp=drive_link)**

---

## 🎯 Projenin Amacı ve Kapsamı

### Amacı
Bu proje; çocukların cihaz kullanımını ailelerin sağlıklı şekilde yönetmesini ve takip etmesini amaçlar. Ebeveynler, çocuk cihazını uygulama üzerinden eşleştirir; süre sınırları koyar, uygulama kullanımını görür ve gerçek zamanlı bildirimler alır.

### Kapsam
* 👥 **Ebeveyn ve Çocuk İçin Ayrı Deneyim:** İki farklı kullanıcı rolüne göre özelleştirilmiş iki ayrı arayüz.
* 🔗 **Cihaz Eşleştirme:** QR kod teknolojisi kullanılarak cihazlar arasında hızlı ve güvenli eşleştirme.
* ⏱️ **Zaman Kısıtları:** Günlük veya saatlik bazda uygulama ve cihaz kullanım sınırlandırmaları.
* 📊 **Kullanım Raporları:** Çocukların hangi uygulamalarda ne kadar vakit geçirdiğini gösteren grafikler ve raporlar.
* 🛡️ **İzin Yönetimi:** Gerekli sistem izinlerinin ebeveyn kontrolünde kolayca yönetilmesi.
* 🔐 **Güvenli Giriş/Çıkış:** Basit, hızlı ve güvenli oturum açma/kapama süreçleri.

---

## ⚙️ Teknik Gereksinimler

* 📱 **Mobil Platform:** iOS & Android (Tek kod tabanı üzerinden çapraz platform desteği)
* 🔑 **Giriş Sistemi:** Güvenli e-posta ve şifre tabanlı oturum yönetimi.
* 🔄 **Gerçek Zamanlı Senkronizasyon:** Ebeveyn ve çocuk cihazları arasında anlık veri iletimi.
* 🔔 **Bildirim Sistemi:** Süre sınırlarının aşılması veya hatırlatmalar durumunda anlık uyarı ve bildirimlerin gönderilmesi.
* 🚦 **Cihaz İzinleri:** Kullanım istatistikleri (UsageStats), bildirimler ve sistem seviyesindeki gerekli izinlerin yönetimi.
* 🗄️ **Esnek Veri Yapısı:** İlerleyen süreçlerde geliştirilmeye ve genişletilmeye uygun, modern veri tabanı mimarisi.

---

## 📊 Veritabanı Şeması

Projede kullanılan ana veri tabloları ve ilişkileri aşağıda belirtilmiştir:

* **Kullanıcılar (`users`)**
  * Ebeveyn ve çocuk profilleri, temel bilgiler ve rol tanımlamaları (ebeveyn/çocuk).
* **Aile / Çiftler (`children`/`pairing_codes`)**
  * Ebeveyn ve çocuk cihazlarının eşleştirme bilgisi, eşleşme tarihi ve aktiflik durumu.
* **Cihazlar (`devices`)**
  * Cihaz kimliği (UUID), işletim sistemi platformu ve cihazın bağlı olduğu kullanıcı.
* **Zaman Kuralları (`block_rules`/`time_restrictions`)**
  * Gün ve saat bazında tanımlanan kurallar ile günlük toplam kullanım süresi limitleri.
* **Kullanım Kayıtları (`usage_stats`)**
  * Uygulama adı, kullanım başlangıç/bitiş zamanları ve toplam kullanım süreleri.
* **Bildirimler (`notifications`)**
  * Bildirim başlığı, içeriği, gönderim zamanı ve alıcı bilgisi.
* **Destek Kayıtları (Opsiyonel)**
  * Kullanıcılardan gelen geri bildirimler, hata raporları ve destek talepleri.

---

## 🔌 API Endpoint Listesi

### 🔑 Kimlik ve Oturum Yönetimi
* `POST /api/auth/register` - Yeni kullanıcı kaydı oluşturma
* `POST /api/auth/login` - Kullanıcı girişi ve oturum başlatma
* `POST /api/auth/logout` - Oturumu sonlandırma
* `POST /api/auth/reset-password` - Şifre sıfırlama talebi

### 🔗 Cihaz Eşleştirme (Pairing)
* `POST /api/pairing/generate` - QR kod eşleştirme kodu oluşturma
* `POST /api/pairing/verify` - QR kodunu doğrulama ve eşleştirme
* `GET /api/pairing/status/:id` - Eşleştirme durumunu sorgulama

### 👤 Profil ve Cihaz İşlemleri
* `GET /api/profile` - Profil bilgilerini getirme
* `PUT /api/profile` - Profil bilgilerini güncelleme
* `POST /api/devices/register` - Yeni cihaz kaydetme
* `GET /api/devices/status/:id` - Cihazın aktiflik durumunu sorgulama

### ⏱️ Zaman Kuralları (Time Rules)
* `POST /api/rules` - Yeni kural tanımlama
* `PUT /api/rules/:id` - Kural güncelleme
* `DELETE /api/rules/:id` - Kuralı kaldırma
* `GET /api/rules` - Aktif zaman kurallarını listeleme

### 📈 Kullanım Raporları (Usage Data)
* `GET /api/usage/report` - Günlük ve haftalık kullanım raporları
* `GET /api/usage/summary` - Toplam süreler ve en çok kullanılan uygulamalar

### 🔔 Bildirimler
* `POST /api/notifications/send` - Belirli bir cihaza bildirim gönderme
* `PUT /api/notifications/:id/read` - Bildirimi okundu olarak işaretleme

---

## 📅 Proje Takvimi

| Süreç | Aşama | Detaylar |
| :--- | :--- | :--- |
| **Hafta 1–2** | 📂 Analiz ve Tasarım | Kullanıcı hikayeleri, ekran akış diyagramları ve arayüz taslakları. |
| **Hafta 3–4** | 🔐 Temel Altyapı ve Giriş | Giriş/çıkış modülleri, profil işlemleri, cihaz kaydı ve QR eşleştirme. |
| **Hafta 5–6** | ⏱️ Zaman Kuralları | Kural tanımlama ve uygulama, arka planda kullanım verilerinin toplanması. |
| **Hafta 7** | 🔔 Bildirimler ve İzinler | Anlık bildirimler, uyarılar ve sistem seviyesi izin akışları. |
| **Hafta 8** | 🧪 Test ve İyileştirme | Hata ayıklama, performans testleri ve kullanılabilirlik geliştirmeleri. |
| **Hafta 9** | 🚀 Yayına Hazırlık | Mağaza (Store) gereksinimleri, son dokunuşlar ve dokümantasyon. |

---

## 🛠️ Geliştirme Adımları

1. **Proje Kurulumu ve Temel Ekranlar:** Açılış (Splash) ekranı, giriş/kayıt panelleri, ebeveyn ve çocuk için özel tasarlanmış ana sayfalar.
2. **Eşleştirme Akışı:** Ebeveyn cihazında QR üretimi, çocuk cihazında kamerayla QR okuma, eşleştirme onayı ve durum takibi.
3. **Zaman Kuralı Yönetimi:** Ebeveyn tarafından ayarlanabilen günlük limitler, saat aralıkları ve istisnai kurallar.
4. **Kullanım Verisi Toplama ve Raporlama:** Çocuk cihazından toplanan verilerin günlük/haftalık özetleri, grafiksel görselleştirmeler ve en çok kullanılan uygulamalar listesi.
5. **Bildirimler:** Zaman limiti yaklaştığında çocuk cihazına uyarı, limit aşıldığında ise ebeveyn cihazına anlık bilgilendirme.
6. **Ayarlar ve Hesap:** Profil güncelleme, şifre değiştirme işlemleri ve güvenli oturum kapatma.
7. **Test, Güvenlik ve Son Düzenlemeler:** Senaryo bazlı akış testleri, beklenmeyen kenar durum (edge case) analizleri, güvenlik kontrolleri ve dil uyumluluğu.
