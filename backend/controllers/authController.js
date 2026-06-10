const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const generateToken = require('../utils/generateToken');

/**
 * POST /api/auth/register
 * Yeni kullanıcı kaydı oluşturur.
 */
const register = (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    // Validasyon
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, şifre ve rol alanları zorunludur.' });
    }

    if (!['parent', 'child'].includes(role)) {
      return res.status(400).json({ message: 'Rol "parent" veya "child" olmalıdır.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır.' });
    }

    // Email kontrolü
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ? COLLATE NOCASE').get(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Bu e-posta adresi zaten kayıtlı.' });
    }

    // Şifreyi hashle
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Kullanıcı oluştur
    const id = uuidv4();
    db.prepare(
      'INSERT INTO users (id, email, password_hash, role, name) VALUES (?, ?, ?, ?, ?)'
    ).run(id, email, passwordHash, role, name || null);

    // Bildirim oluştur
    const notifId = uuidv4();
    db.prepare(
      'INSERT INTO notifications (id, user_id, title, message) VALUES (?, ?, ?, ?)'
    ).run(notifId, id, 'Hoş Geldiniz!', 'Kilit uygulamasına başarıyla kayıt oldunuz.');

    res.status(201).json({
      message: 'Kayıt başarılı.',
      user: { id, email, role, name: name || null },
    });
  } catch (error) {
    console.error('Register hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * POST /api/auth/login
 * Kullanıcı girişi yapar ve JWT token döner.
 */
const login = (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasyon
    if (!email || !password) {
      return res.status(400).json({ message: 'Email ve şifre alanları zorunludur.' });
    }

    // Kullanıcıyı bul
    const user = db.prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE').get(email);
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    // Şifreyi doğrula
    const isValidPassword = bcrypt.compareSync(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    // Token oluştur
    const token = generateToken(user);

    res.json({
      message: 'Giriş başarılı.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

/**
 * POST /api/auth/logout
 * Kullanıcı çıkışı (client-side token silme ile tamamlanır).
 */
const logout = (req, res) => {
  // JWT stateless olduğu için server-side'da token invalidation yapılmıyor.
  // Client tarafında token silinir.
  res.json({ message: 'Çıkış başarılı.' });
};

module.exports = { register, login, logout };
