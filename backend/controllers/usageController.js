const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

/**
 * GET /api/usage/stats
 */
const getUsageStats = (req, res) => {
  try {
    let stats;
    if (req.user.role === 'parent') {
      stats = db.prepare(`
        SELECT us.*, c.name as child_name
        FROM usage_stats us
        JOIN children c ON c.id = us.child_id
        WHERE c.parent_id = ?
        ORDER BY us.usage_date DESC, us.usage_minutes DESC
      `).all(req.user.id);
    } else {
      const childRecord = db.prepare('SELECT id FROM children WHERE child_user_id = ?').get(req.user.id);
      if (!childRecord) return res.json({ stats: [] });
      stats = db.prepare('SELECT * FROM usage_stats WHERE child_id = ? ORDER BY usage_date DESC').all(childRecord.id);
    }
    res.json({ stats });
  } catch (error) {
    console.error('getUsageStats hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * POST /api/usage/stats
 */
const addUsageStat = (req, res) => {
  try {
    const { app_name, package_name, usage_minutes, usage_date } = req.body;
    if (!app_name || !package_name || usage_minutes === undefined || !usage_date) {
      return res.status(400).json({ message: 'app_name, package_name, usage_minutes ve usage_date zorunludur.' });
    }
    const childRecord = db.prepare('SELECT id, parent_id, name FROM children WHERE child_user_id = ?').get(req.user.id);
    if (!childRecord) {
      return res.status(404).json({ message: 'Çocuk kaydı bulunamadı. Önce eşleştirme yapınız.' });
    }
    const id = uuidv4();
    db.prepare('INSERT INTO usage_stats (id, child_id, app_name, package_name, usage_minutes, usage_date) VALUES (?, ?, ?, ?, ?, ?)').run(id, childRecord.id, app_name, package_name, usage_minutes, usage_date);
    
    // Check time restrictions and generate notifications if needed
    const restriction = db.prepare(
      'SELECT * FROM time_restrictions WHERE child_id = ? AND package_name = ? AND is_active = 1'
    ).get(childRecord.id, package_name);

    if (restriction) {
      const limit = restriction.daily_limit;
      const childName = childRecord.name || 'Çocuğunuz';
      const parentUserId = childRecord.parent_id;

      // Prevent duplicate alerts on the same day
      const todayStart = usage_date + ' 00:00:00';
      const todayEnd = usage_date + ' 23:59:59';

      if (usage_minutes >= limit) {
        // Limit Exceeded Notification
        const alreadyAlerted = db.prepare(`
          SELECT id FROM notifications 
          WHERE user_id = ? AND title = 'Limit Aşıldı' AND message LIKE ? AND created_at BETWEEN ? AND ?
        `).get(parentUserId, `%${app_name}%`, todayStart, todayEnd);

        if (!alreadyAlerted) {
          const notifId = uuidv4();
          db.prepare(`
            INSERT INTO notifications (id, user_id, title, message)
            VALUES (?, ?, ?, ?)
          `).run(
            notifId,
            parentUserId,
            'Limit Aşıldı',
            `${childName} adlı çocuğunuz ${app_name} uygulaması için belirlenen ${limit} dakikalık günlük limiti aştı!`
          );
        }
      } else if (usage_minutes >= limit - 10) {
        // Limit Approaching Notification
        const alreadyAlerted = db.prepare(`
          SELECT id FROM notifications 
          WHERE user_id = ? AND title = 'Limit Yaklaştı' AND message LIKE ? AND created_at BETWEEN ? AND ?
        `).get(parentUserId, `%${app_name}%`, todayStart, todayEnd);

        if (!alreadyAlerted) {
          const notifId = uuidv4();
          db.prepare(`
            INSERT INTO notifications (id, user_id, title, message)
            VALUES (?, ?, ?, ?)
          `).run(
            notifId,
            parentUserId,
            'Limit Yaklaştı',
            `${childName} adlı çocuğunuz ${app_name} uygulaması için belirlenen günlük limite yaklaşıyor (Kalan: 10 dk).`
          );
        }
      }
    }

    const stat = db.prepare('SELECT * FROM usage_stats WHERE id = ?').get(id);
    res.status(201).json({ message: 'Kullanım verisi eklendi.', stat });
  } catch (error) {
    console.error('addUsageStat hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * GET /api/usage/daily-summary
 */
const getDailySummary = (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    let summary;
    if (req.user.role === 'parent') {
      summary = db.prepare(`
        SELECT us.app_name, us.package_name, SUM(us.usage_minutes) as total_minutes, c.name as child_name
        FROM usage_stats us JOIN children c ON c.id = us.child_id
        WHERE c.parent_id = ? AND us.usage_date = ?
        GROUP BY us.app_name, us.package_name, c.id ORDER BY total_minutes DESC
      `).all(req.user.id, date);
    } else {
      const childRecord = db.prepare('SELECT id FROM children WHERE child_user_id = ?').get(req.user.id);
      if (!childRecord) return res.json({ summary: [], totalMinutes: 0, date });
      summary = db.prepare(`
        SELECT app_name, package_name, SUM(usage_minutes) as total_minutes
        FROM usage_stats WHERE child_id = ? AND usage_date = ?
        GROUP BY app_name, package_name ORDER BY total_minutes DESC
      `).all(childRecord.id, date);
    }
    const totalMinutes = summary.reduce((sum, item) => sum + item.total_minutes, 0);
    res.json({ date, summary, totalMinutes, totalApps: summary.length });
  } catch (error) {
    console.error('getDailySummary hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { getUsageStats, addUsageStat, getDailySummary };
