const bcrypt = require('bcryptjs');
const db = require('../config/database');

/**
 * GET /api/users/profile
 * Oturum açmış kullanıcının profil bilgilerini döner.
 */
const getProfile = (req, res) => {
  try {
    const user = db.prepare(
      'SELECT id, email, role, name, created_at FROM users WHERE id = ?'
    ).get(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    res.json({ user });
  } catch (error) {
    console.error('getProfile hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * GET /api/users/:parentId/children
 * Ebeveynin eşleştirilmiş çocuklarını listeler.
 * Sadece kendi çocuklarını görebilir.
 */
const getChildren = (req, res) => {
  try {
    const { parentId } = req.params;

    // Yetki kontrolü: sadece kendi çocuklarını görebilir
    if (req.user.id !== parentId && req.user.role !== 'parent') {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok.' });
    }

    const children = db.prepare(`
      SELECT 
        c.id,
        c.parent_id,
        c.child_user_id,
        c.name,
        c.age,
        c.created_at,
        u.email as child_email
      FROM children c
      LEFT JOIN users u ON u.id = c.child_user_id
      WHERE c.parent_id = ?
    `).all(parentId);

    res.json({ children });
  } catch (error) {
    console.error('getChildren hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

const updateProfile = (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Ad Soyad ve E-posta alanları zorunludur.' });
    }

    // E-posta benzersizlik kontrolü
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ? COLLATE NOCASE AND id != ?').get(email, req.user.id);
    if (existingUser) {
      return res.status(409).json({ message: 'Bu e-posta adresi zaten kullanımda.' });
    }

    db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').run(name, email, req.user.id);

    const user = db.prepare(
      'SELECT id, email, role, name, created_at FROM users WHERE id = ?'
    ).get(req.user.id);

    res.json({ message: 'Profil güncellendi.', user });
  } catch (error) {
    console.error('updateProfile hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

const updatePassword = (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Eski şifre ve yeni şifre zorunludur.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Yeni şifre en az 6 karakter olmalıdır.' });
    }

    // Kullanıcıyı bul
    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // Eski şifreyi doğrula
    const isValidPassword = bcrypt.compareSync(oldPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Eski şifre hatalı.' });
    }

    // Yeni şifreyi hashle ve güncelle
    const salt = bcrypt.genSaltSync(10);
    const newPasswordHash = bcrypt.hashSync(newPassword, salt);

    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newPasswordHash, req.user.id);

    res.json({ message: 'Şifre başarıyla değiştirildi.' });
  } catch (error) {
    console.error('updatePassword hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

const deleteProfile = (req, res) => {
  try {
    db.prepare('DELETE FROM users WHERE id = ?').run(req.user.id);
    res.json({ message: 'Hesap başarıyla silindi.' });
  } catch (error) {
    console.error('deleteProfile hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

const deleteChild = (req, res) => {
  try {
    const { childId } = req.params;

    // Yetki kontrolü: çocuk bu ebeveyne mi ait?
    const child = db.prepare('SELECT id FROM children WHERE id = ? AND parent_id = ?').get(childId, req.user.id);
    if (!child) {
      return res.status(404).json({ message: 'Çocuk bulunamadı veya bu işlem için yetkiniz yok.' });
    }

    db.prepare('DELETE FROM children WHERE id = ?').run(childId);
    res.json({ message: 'Çocuk bağlantısı başarıyla silindi.' });
  } catch (error) {
    console.error('deleteChild hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = { getProfile, getChildren, updateProfile, updatePassword, deleteProfile, deleteChild };

