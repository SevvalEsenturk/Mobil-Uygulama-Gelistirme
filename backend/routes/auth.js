const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Kimlik doğrulama işlemleri
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, role]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: [parent, child]
 *                 example: parent
 *               name:
 *                 type: string
 *                 example: Ahmet Yılmaz
 *     responses:
 *       201:
 *         description: Kayıt başarılı
 *       400:
 *         description: Eksik veya geçersiz alan
 *       409:
 *         description: E-posta zaten kayıtlı
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: parent@test.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Giriş başarılı, JWT token döner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Geçersiz e-posta veya şifre
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Kullanıcı çıkışı
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Çıkış başarılı
 */
router.post('/logout', logout);

module.exports = router;
