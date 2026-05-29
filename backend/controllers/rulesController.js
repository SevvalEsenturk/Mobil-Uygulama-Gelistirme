const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

// ===================== BLOCK RULES =====================

/**
 * GET /api/rules/block
 * Engelleme kurallarını listeler.
 * Parent: kendi oluşturduğu kuralları görür.
 * Child: kendisine uygulanan kuralları görür.
 */
const getBlockRules = (req, res) => {
  try {
    let rules;

    if (req.user.role === 'parent') {
      rules = db.prepare(`
        SELECT br.*, c.name as child_name
        FROM block_rules br
        LEFT JOIN children c ON c.id = br.child_id
        WHERE br.parent_id = ?
      `).all(req.user.id);
    } else {
      // Child kullanıcı — kendisine atanmış kuralları getir
      const childRecord = db.prepare(
        'SELECT id FROM children WHERE child_user_id = ?'
      ).get(req.user.id);

      if (!childRecord) {
        return res.json({ rules: [] });
      }

      rules = db.prepare(
        'SELECT * FROM block_rules WHERE child_id = ?'
      ).all(childRecord.id);
    }

    res.json({ rules });
  } catch (error) {
    console.error('getBlockRules hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * POST /api/rules/block
 * Yeni engelleme kuralı oluşturur. Sadece parent yapabilir.
 */
const createBlockRule = (req, res) => {
  try {
    const { child_id, app_name, package_name, is_blocked } = req.body;

    if (!child_id || !app_name || !package_name) {
      return res.status(400).json({
        message: 'child_id, app_name ve package_name alanları zorunludur.',
      });
    }

    // Çocuğun bu parent'a ait olup olmadığını kontrol et
    const child = db.prepare(
      'SELECT id FROM children WHERE id = ? AND parent_id = ?'
    ).get(child_id, req.user.id);

    if (!child) {
      return res.status(404).json({ message: 'Çocuk kaydı bulunamadı veya size ait değil.' });
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO block_rules (id, parent_id, child_id, app_name, package_name, is_blocked)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, req.user.id, child_id, app_name, package_name, is_blocked !== undefined ? (is_blocked ? 1 : 0) : 1);

    // Bildirim oluştur
    const childRecord = db.prepare('SELECT child_user_id FROM children WHERE id = ?').get(child_id);
    if (childRecord) {
      const notifId = uuidv4();
      db.prepare(
        'INSERT INTO notifications (id, user_id, title, message) VALUES (?, ?, ?, ?)'
      ).run(notifId, childRecord.child_user_id, 'Uygulama Engellendi', `${app_name} uygulaması engellendi.`);
    }

    const rule = db.prepare('SELECT * FROM block_rules WHERE id = ?').get(id);

    res.status(201).json({ message: 'Engelleme kuralı oluşturuldu.', rule });
  } catch (error) {
    console.error('createBlockRule hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * DELETE /api/rules/block/:id
 * Engelleme kuralını siler. Sadece parent yapabilir.
 */
const deleteBlockRule = (req, res) => {
  try {
    const { id } = req.params;

    const rule = db.prepare(
      'SELECT * FROM block_rules WHERE id = ? AND parent_id = ?'
    ).get(id, req.user.id);

    if (!rule) {
      return res.status(404).json({ message: 'Engelleme kuralı bulunamadı.' });
    }

    db.prepare('DELETE FROM block_rules WHERE id = ?').run(id);

    res.json({ message: 'Engelleme kuralı silindi.' });
  } catch (error) {
    console.error('deleteBlockRule hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// ===================== TIME RESTRICTIONS =====================

/**
 * GET /api/rules/time-restrictions
 * Zaman kısıtlamalarını listeler.
 */
const getTimeRestrictions = (req, res) => {
  try {
    let restrictions;

    if (req.user.role === 'parent') {
      restrictions = db.prepare(`
        SELECT tr.*, c.name as child_name
        FROM time_restrictions tr
        LEFT JOIN children c ON c.id = tr.child_id
        WHERE tr.parent_id = ?
      `).all(req.user.id);
    } else {
      const childRecord = db.prepare(
        'SELECT id FROM children WHERE child_user_id = ?'
      ).get(req.user.id);

      if (!childRecord) {
        return res.json({ restrictions: [] });
      }

      restrictions = db.prepare(
        'SELECT * FROM time_restrictions WHERE child_id = ?'
      ).all(childRecord.id);
    }

    res.json({ restrictions });
  } catch (error) {
    console.error('getTimeRestrictions hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * POST /api/rules/time-restrictions
 * Yeni zaman kısıtlaması oluşturur. Sadece parent yapabilir.
 */
const createTimeRestriction = (req, res) => {
  try {
    const { child_id, app_name, package_name, day_of_week, start_time, end_time, is_active } = req.body;

    if (!child_id || !app_name || !package_name || !day_of_week || !start_time || !end_time) {
      return res.status(400).json({
        message: 'child_id, app_name, package_name, day_of_week, start_time ve end_time zorunludur.',
      });
    }

    // Çocuğun bu parent'a ait olup olmadığını kontrol et
    const child = db.prepare(
      'SELECT id FROM children WHERE id = ? AND parent_id = ?'
    ).get(child_id, req.user.id);

    if (!child) {
      return res.status(404).json({ message: 'Çocuk kaydı bulunamadı veya size ait değil.' });
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO time_restrictions (id, parent_id, child_id, app_name, package_name, day_of_week, start_time, end_time, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.user.id, child_id, app_name, package_name, day_of_week, start_time, end_time, is_active !== undefined ? (is_active ? 1 : 0) : 1);

    const restriction = db.prepare('SELECT * FROM time_restrictions WHERE id = ?').get(id);

    res.status(201).json({ message: 'Zaman kısıtlaması oluşturuldu.', restriction });
  } catch (error) {
    console.error('createTimeRestriction hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * PUT /api/rules/time-restrictions/:id
 * Zaman kısıtlamasını günceller. Sadece parent yapabilir.
 */
const updateTimeRestriction = (req, res) => {
  try {
    const { id } = req.params;
    const { app_name, package_name, day_of_week, start_time, end_time, is_active } = req.body;

    const existing = db.prepare(
      'SELECT * FROM time_restrictions WHERE id = ? AND parent_id = ?'
    ).get(id, req.user.id);

    if (!existing) {
      return res.status(404).json({ message: 'Zaman kısıtlaması bulunamadı.' });
    }

    db.prepare(`
      UPDATE time_restrictions
      SET app_name = ?, package_name = ?, day_of_week = ?, start_time = ?, end_time = ?, is_active = ?
      WHERE id = ?
    `).run(
      app_name || existing.app_name,
      package_name || existing.package_name,
      day_of_week || existing.day_of_week,
      start_time || existing.start_time,
      end_time || existing.end_time,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      id
    );

    const updated = db.prepare('SELECT * FROM time_restrictions WHERE id = ?').get(id);

    res.json({ message: 'Zaman kısıtlaması güncellendi.', restriction: updated });
  } catch (error) {
    console.error('updateTimeRestriction hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * DELETE /api/rules/time-restrictions/:id
 * Zaman kısıtlamasını siler. Sadece parent yapabilir.
 */
const deleteTimeRestriction = (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.prepare(
      'SELECT * FROM time_restrictions WHERE id = ? AND parent_id = ?'
    ).get(id, req.user.id);

    if (!existing) {
      return res.status(404).json({ message: 'Zaman kısıtlaması bulunamadı.' });
    }

    db.prepare('DELETE FROM time_restrictions WHERE id = ?').run(id);

    res.json({ message: 'Zaman kısıtlaması silindi.' });
  } catch (error) {
    console.error('deleteTimeRestriction hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = {
  getBlockRules,
  createBlockRule,
  deleteBlockRule,
  getTimeRestrictions,
  createTimeRestriction,
  updateTimeRestriction,
  deleteTimeRestriction,
};
