const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * JWT token doğrulama middleware'i.
 * Authorization: Bearer TOKEN header'ını kontrol eder.
 * Doğrulanan kullanıcıyı req.user'a atar.
 */
const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Yetkilendirme token\'ı gerekli.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcının hala var olup olmadığını kontrol et
    const user = db.prepare('SELECT id, email, role, name, created_at FROM users WHERE id = ?').get(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token süresi dolmuş.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Geçersiz token.' });
    }
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

module.exports = auth;
