const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { generateCode, pairDevice } = require('../controllers/pairingController');
const { pairingRateLimiter } = require('../middleware/pairingRateLimiter');

/**
 * @swagger
 * tags:
 *   name: Pairing
 *   description: Cihaz eşleştirme işlemleri
 */

/**
 * @swagger
 * /api/pairing/generate:
 *   post:
 *     summary: Eşleştirme kodu oluştur (Sadece Parent - Eski Endpoint)
 *     tags: [Pairing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Eşleştirme kodu oluşturuldu
 */
router.post('/generate', auth, requireRole('parent'), generateCode);

/**
 * @swagger
 * /api/pair/create-code:
 *   post:
 *     summary: Eşleştirme kodu oluştur (Sadece Parent - Yeni Endpoint)
 *     tags: [Pairing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Eşleştirme kodu oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 code:
 *                   type: string
 *                   example: "A7K29Q"
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *                 expiryMinutes:
 *                   type: integer
 *                   example: 5
 */
router.post('/create-code', auth, requireRole('parent'), generateCode);

/**
 * @swagger
 * /api/pairing/pair:
 *   post:
 *     summary: Eşleştirme kodu ile bağlan (Sadece Child - Eski Endpoint)
 *     tags: [Pairing]
 *     security:
 *       - bearerAuth: []
 */
router.post('/pair', auth, requireRole('child'), pairingRateLimiter, pairDevice);

/**
 * @swagger
 * /api/pair/verify-code:
 *   post:
 *     summary: Eşleştirme kodu ile bağlan (Sadece Child - Yeni Endpoint)
 *     tags: [Pairing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code]
 *             properties:
 *               code:
 *                 type: string
 *                 example: "A7K29Q"
 *               name:
 *                 type: string
 *                 example: Elif
 *               age:
 *                 type: integer
 *                 example: 12
 *               device_name:
 *                 type: string
 *                 example: Samsung Galaxy A52
 *               platform:
 *                 type: string
 *                 example: android
 *               device_identifier:
 *                 type: string
 *     responses:
 *       201:
 *         description: Eşleştirme başarılı
 *       404:
 *         description: Geçersiz veya kullanılmış kod
 *       409:
 *         description: Zaten eşleştirilmiş
 *       410:
 *         description: Kodun süresi dolmuş
 *       429:
 *         description: Çok fazla hatalı deneme (Rate Limited)
 */
router.post('/verify-code', auth, requireRole('child'), pairingRateLimiter, pairDevice);

module.exports = router;
