const jwt = require('jsonwebtoken');

/**
 * JWT token oluşturur.
 * @param {Object} user - Kullanıcı nesnesi (id, email, role)
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;
