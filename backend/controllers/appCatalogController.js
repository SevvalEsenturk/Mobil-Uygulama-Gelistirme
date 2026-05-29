const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

/**
 * GET /api/app-catalog
 * Uygulama kataloğunu listeler. Opsiyonel category filtresi.
 */
const getApps = (req, res) => {
  try {
    const { category } = req.query;
    let apps;

    if (category) {
      apps = db.prepare('SELECT * FROM app_catalog WHERE category = ? ORDER BY app_name').all(category);
    } else {
      apps = db.prepare('SELECT * FROM app_catalog ORDER BY app_name').all();
    }

    res.json({ apps });
  } catch (error) {
    console.error('getApps hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * GET /api/app-catalog/:id
 * Tek bir uygulamanın detayını döner.
 */
const getAppById = (req, res) => {
  try {
    const app = db.prepare('SELECT * FROM app_catalog WHERE id = ?').get(req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'Uygulama bulunamadı.' });
    }
    res.json({ app });
  } catch (error) {
    console.error('getAppById hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * POST /api/app-catalog
 * Yeni uygulama ekler.
 */
const createApp = (req, res) => {
  try {
    const { app_name, package_name, category, icon_url } = req.body;

    if (!app_name || !package_name) {
      return res.status(400).json({ message: 'app_name ve package_name zorunludur.' });
    }

    // Aynı package_name var mı kontrol et
    const existing = db.prepare('SELECT id FROM app_catalog WHERE package_name = ?').get(package_name);
    if (existing) {
      return res.status(409).json({ message: 'Bu package_name zaten kayıtlı.', app: existing });
    }

    const id = uuidv4();
    db.prepare(
      'INSERT INTO app_catalog (id, app_name, package_name, category, icon_url) VALUES (?, ?, ?, ?, ?)'
    ).run(id, app_name, package_name, category || null, icon_url || null);

    const app = db.prepare('SELECT * FROM app_catalog WHERE id = ?').get(id);
    res.status(201).json({ message: 'Uygulama eklendi.', app });
  } catch (error) {
    console.error('createApp hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * DELETE /api/app-catalog/:id
 * Uygulamayı siler.
 */
const deleteApp = (req, res) => {
  try {
    const app = db.prepare('SELECT * FROM app_catalog WHERE id = ?').get(req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'Uygulama bulunamadı.' });
    }

    db.prepare('DELETE FROM app_catalog WHERE id = ?').run(req.params.id);
    res.json({ message: 'Uygulama silindi.' });
  } catch (error) {
    console.error('deleteApp hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { getApps, getAppById, createApp, deleteApp };
