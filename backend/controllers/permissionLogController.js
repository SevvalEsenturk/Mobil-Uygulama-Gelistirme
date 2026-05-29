const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

/**
 * GET /api/permission-logs
 * İzin loglarını listeler.
 * Parent: çocuklarının cihazlarındaki izin durumlarını görür.
 * Child: kendi cihazındaki izin durumlarını görür.
 */
const getPermissionLogs = (req, res) => {
  try {
    let logs;

    if (req.user.role === 'parent') {
      logs = db.prepare(`
        SELECT pl.*, d.device_name, d.platform, c.name as child_name
        FROM permission_logs pl
        JOIN devices d ON d.id = pl.device_id
        JOIN children c ON c.id = d.child_id
        WHERE c.parent_id = ?
        ORDER BY pl.checked_at DESC
      `).all(req.user.id);
    } else {
      const childRecord = db.prepare('SELECT id FROM children WHERE child_user_id = ?').get(req.user.id);
      if (!childRecord) return res.json({ logs: [] });

      logs = db.prepare(`
        SELECT pl.*, d.device_name, d.platform
        FROM permission_logs pl
        JOIN devices d ON d.id = pl.device_id
        WHERE d.child_id = ?
        ORDER BY pl.checked_at DESC
      `).all(childRecord.id);
    }

    res.json({ logs });
  } catch (error) {
    console.error('getPermissionLogs hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * POST /api/permission-logs
 * İzin durumu kaydeder. Sadece child yapabilir.
 */
const createPermissionLog = (req, res) => {
  try {
    const { device_id, permission_type, is_granted } = req.body;

    if (!device_id || !permission_type) {
      return res.status(400).json({ message: 'device_id ve permission_type zorunludur.' });
    }

    const validTypes = ['usage_access', 'notification', 'accessibility', 'overlay', 'device_admin', 'battery_optimization'];
    if (!validTypes.includes(permission_type)) {
      return res.status(400).json({ message: `Geçersiz permission_type. Geçerli değerler: ${validTypes.join(', ')}` });
    }

    // Cihazın bu child'a ait olup olmadığını kontrol et
    const childRecord = db.prepare('SELECT id FROM children WHERE child_user_id = ?').get(req.user.id);
    if (!childRecord) {
      return res.status(404).json({ message: 'Çocuk kaydı bulunamadı.' });
    }

    const device = db.prepare('SELECT id FROM devices WHERE id = ? AND child_id = ?').get(device_id, childRecord.id);
    if (!device) {
      return res.status(404).json({ message: 'Cihaz bulunamadı veya size ait değil.' });
    }

    const id = uuidv4();
    const checkedAt = new Date().toISOString();
    db.prepare(
      'INSERT INTO permission_logs (id, device_id, permission_type, is_granted, checked_at) VALUES (?, ?, ?, ?, ?)'
    ).run(id, device_id, permission_type, is_granted ? 1 : 0, checkedAt);

    // Eğer izin verilmediyse parent'a bildirim gönder
    if (!is_granted) {
      const parentId = db.prepare('SELECT parent_id FROM children WHERE id = ?').get(childRecord.id)?.parent_id;
      if (parentId) {
        const notifId = uuidv4();
        const typeLabels = {
          usage_access: 'Kullanım Erişimi',
          notification: 'Bildirim',
          accessibility: 'Erişilebilirlik',
          overlay: 'Ekran Üstü',
          device_admin: 'Cihaz Yöneticisi',
          battery_optimization: 'Pil Optimizasyonu',
        };
        db.prepare(
          'INSERT INTO notifications (id, user_id, title, message) VALUES (?, ?, ?, ?)'
        ).run(notifId, parentId, 'İzin Uyarısı', `${typeLabels[permission_type]} izni verilmemiş durumda.`);
      }
    }

    const log = db.prepare('SELECT * FROM permission_logs WHERE id = ?').get(id);
    res.status(201).json({ message: 'İzin durumu kaydedildi.', log });
  } catch (error) {
    console.error('createPermissionLog hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * GET /api/permission-logs/device/:deviceId/latest
 * Bir cihazın en son izin durumlarını döner (her izin türü için en son kayıt).
 */
const getLatestPermissions = (req, res) => {
  try {
    const { deviceId } = req.params;

    const logs = db.prepare(`
      SELECT pl1.*
      FROM permission_logs pl1
      INNER JOIN (
        SELECT permission_type, MAX(checked_at) as max_checked
        FROM permission_logs
        WHERE device_id = ?
        GROUP BY permission_type
      ) pl2 ON pl1.permission_type = pl2.permission_type AND pl1.checked_at = pl2.max_checked
      WHERE pl1.device_id = ?
      ORDER BY pl1.permission_type
    `).all(deviceId, deviceId);

    res.json({ device_id: deviceId, permissions: logs });
  } catch (error) {
    console.error('getLatestPermissions hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { getPermissionLogs, createPermissionLog, getLatestPermissions };
