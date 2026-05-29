const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

/**
 * POST /api/users/child-apps
 * Çocuğun cihazındaki yüklü uygulamaları veritabanına senkronize eder.
 * Sadece child yetkisiyle çalışır.
 */
const syncChildApps = (req, res) => {
  try {
    const { apps } = req.body; // Array of { app_name, package_name, icon_url }
    if (!apps || !Array.isArray(apps)) {
      return res.status(400).json({ message: 'Uygulama listesi "apps" dizisi olarak zorunludur.' });
    }

    // Çocuk kaydını bul
    const childRecord = db.prepare('SELECT id FROM children WHERE child_user_id = ?').get(req.user.id);
    if (!childRecord) {
      return res.status(404).json({ message: 'Eşleşmiş çocuk kaydı bulunamadı. Lütfen önce cihazı eşleştirin.' });
    }

    const childId = childRecord.id;

    // SQLite Transaction ile toplu ekleme
    const deleteExisting = db.prepare('DELETE FROM child_apps WHERE child_id = ?');
    const insertApp = db.prepare(`
      INSERT OR REPLACE INTO child_apps (id, child_id, app_name, package_name, icon_url)
      VALUES (?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((appList) => {
      // Önce mevcut listeyi sıfırla (temiz senkronizasyon için)
      deleteExisting.run(childId);
      
      // Yeni listeyi ekle
      for (const app of appList) {
        if (app.app_name && app.package_name) {
          const id = uuidv4();
          insertApp.run(id, childId, app.app_name, app.package_name, app.icon_url || null);
        }
      }
    });

    transaction(apps);

    res.status(201).json({ message: 'Uygulama listesi başarıyla senkronize edildi.', total: apps.length });
  } catch (error) {
    console.error('syncChildApps hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * GET /api/users/:childId/child-apps
 * Belirtilen çocuğun cihazındaki yüklü uygulamaları getirir.
 * Hem ebeveyn (yetkisi dahilinde) hem çocuk görebilir.
 */
const getChildApps = (req, res) => {
  try {
    const { childId } = req.params;

    // Yetki Kontrolü: Ebeveyn ise bu çocuk onun mu?
    if (req.user.role === 'parent') {
      const child = db.prepare('SELECT id FROM children WHERE id = ? AND parent_id = ?').get(childId, req.user.id);
      if (!child) {
        return res.status(403).json({ message: 'Bu çocuğun uygulamalarını görme yetkiniz yok.' });
      }
    } else {
      // Çocuk ise sadece kendi verisini görebilir
      const child = db.prepare('SELECT id FROM children WHERE id = ? AND child_user_id = ?').get(childId, req.user.id);
      if (!child) {
        return res.status(403).json({ message: 'Sadece kendi uygulama listenizi görebilirsiniz.' });
      }
    }

    const apps = db.prepare('SELECT * FROM child_apps WHERE child_id = ? ORDER BY app_name').all(childId);

    res.json({ apps });
  } catch (error) {
    console.error('getChildApps hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { syncChildApps, getChildApps };
