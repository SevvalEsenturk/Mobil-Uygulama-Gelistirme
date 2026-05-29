/**
 * Rol tabanlı yetkilendirme middleware'i.
 * Belirtilen rollere sahip kullanıcıların erişimine izin verir.
 * auth middleware'inden sonra kullanılmalıdır.
 *
 * Kullanım: requireRole('parent') veya requireRole('parent', 'child')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Bu işlem için yetkiniz yok.',
        requiredRole: roles,
        currentRole: req.user.role,
      });
    }

    next();
  };
};

module.exports = requireRole;
