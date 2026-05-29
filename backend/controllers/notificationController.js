const db = require('../config/database');

/**
 * GET /api/notifications
 * Kullanıcının bildirimlerini listeler.
 */
const getNotifications = (req, res) => {
  try {
    const notifications = db.prepare(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC'
    ).all(req.user.id);

    const unreadCount = db.prepare(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0'
    ).get(req.user.id).count;

    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error('getNotifications hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * PUT /api/notifications/:id/read
 * Bildirimi okundu olarak işaretler.
 */
const markAsRead = (req, res) => {
  try {
    const { id } = req.params;

    const notification = db.prepare(
      'SELECT * FROM notifications WHERE id = ? AND user_id = ?'
    ).get(id, req.user.id);

    if (!notification) {
      return res.status(404).json({ message: 'Bildirim bulunamadı.' });
    }

    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(id);

    res.json({ message: 'Bildirim okundu olarak işaretlendi.' });
  } catch (error) {
    console.error('markAsRead hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { getNotifications, markAsRead };
