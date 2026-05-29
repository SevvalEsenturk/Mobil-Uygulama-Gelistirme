const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const db = require('../config/database');
const generatePairingCode = require('../utils/generatePairingCode');
const { recordFailedAttempt, resetFailedAttempts } = require('../middleware/pairingRateLimiter');

// SHA-256 hash fonksiyonu
const hashString = (str) => {
  return crypto.createHash('sha256').update(str).digest('hex');
};

/**
 * POST /api/pairing/generate veya POST /api/pair/create-code
 * Eşleştirme kodu oluşturur. Sadece parent yapabilir.
 * Kod 5 dakika geçerlidir ve veritabanında SHA-256 ile hashli saklanır.
 */
const generateCode = (req, res) => {
  try {
    const nowISO = new Date().toISOString();

    // Süresi dolan tüm eşleştirme kodlarını veritabanından otomatik temizle (Auto-Cleanup)
    db.prepare('DELETE FROM pairing_codes WHERE expires_at < ?').run(nowISO);

    const expiryMinutes = 5; // Kod 5 dakika geçerlidir
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString();
    const code = generatePairingCode(); // Ham kod (örn: "A7K29Q" veya "X4P8LM2R")
    const hashedCode = hashString(code);
    const id = uuidv4();

    db.prepare(
      'INSERT INTO pairing_codes (id, parent_id, code, expires_at) VALUES (?, ?, ?, ?)'
    ).run(id, req.user.id, hashedCode, expiresAt);

    // Ebeveyne arayüzde göstermesi için ham (unhashed) kodu dönüyoruz
    res.status(201).json({
      message: 'Eşleştirme kodu oluşturuldu.',
      code,
      expiresAt,
      expiryMinutes,
    });
  } catch (error) {
    console.error('generateCode hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * POST /api/pairing/pair veya POST /api/pair/verify-code
 * Child kullanıcı eşleştirme kodunu kullanarak parent'a bağlanır.
 */
const pairDevice = (req, res) => {
  try {
    const { code, name, age, device_name, platform, device_identifier } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Eşleştirme kodu zorunludur.' });
    }

    const cleanCode = code.replace(/\s+/g, '').toUpperCase();
    const hashedCode = hashString(cleanCode);

    // Kodu hash'ine göre veritabanında bul
    const pairingCode = db.prepare(
      'SELECT * FROM pairing_codes WHERE code = ? AND used = 0'
    ).get(hashedCode);

    if (!pairingCode) {
      recordFailedAttempt(req.user.id); // Rate limiter sayacını artır
      return res.status(404).json({ message: 'Geçersiz veya kullanılmış eşleştirme kodu.' });
    }

    // Süre kontrolü
    if (new Date(pairingCode.expires_at) < new Date()) {
      recordFailedAttempt(req.user.id); // Rate limiter sayacını artır
      return res.status(410).json({ message: 'Eşleştirme kodunun süresi dolmuş.' });
    }

    // Zaten eşleştirilmiş mi kontrol et
    const existingChild = db.prepare(
      'SELECT id FROM children WHERE parent_id = ? AND child_user_id = ?'
    ).get(pairingCode.parent_id, req.user.id);

    if (existingChild) {
      return res.status(409).json({ message: 'Bu ebeveyn ile zaten eşleştirilmiş.' });
    }

    // Children kaydı oluştur
    const childId = uuidv4();
    db.prepare(
      'INSERT INTO children (id, parent_id, child_user_id, name, age) VALUES (?, ?, ?, ?, ?)'
    ).run(childId, pairingCode.parent_id, req.user.id, name || req.user.name || 'Çocuk', age || null);

    // Cihaz bilgisi varsa kaydet
    if (device_name || platform || device_identifier) {
      const deviceId = uuidv4();
      db.prepare(
        'INSERT INTO devices (id, child_id, device_name, platform, device_identifier) VALUES (?, ?, ?, ?, ?)'
      ).run(deviceId, childId, device_name || null, platform || null, device_identifier || null);
    }

    // Kodu kullanılmış olarak işaretle
    db.prepare('UPDATE pairing_codes SET used = 1 WHERE id = ?').run(pairingCode.id);

    // Başarılı eşleşmede rate limiter kaydını sıfırla
    resetFailedAttempts(req.user.id);

    // Bildirimleri oluştur
    const notif1Id = uuidv4();
    const notif2Id = uuidv4();
    db.prepare(
      'INSERT INTO notifications (id, user_id, title, message) VALUES (?, ?, ?, ?)'
    ).run(notif1Id, pairingCode.parent_id, 'Yeni Eşleştirme', 'Çocuk cihazı başarıyla eşleştirildi.');
    db.prepare(
      'INSERT INTO notifications (id, user_id, title, message) VALUES (?, ?, ?, ?)'
    ).run(notif2Id, req.user.id, 'Eşleştirme Tamamlandı', 'Ebeveyn cihazı ile başarıyla eşleştirildiniz.');

    res.status(201).json({
      message: 'Eşleştirme başarılı.',
      child: { id: childId, parent_id: pairingCode.parent_id, child_user_id: req.user.id },
    });
  } catch (error) {
    console.error('pairDevice hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { generateCode, pairDevice };

