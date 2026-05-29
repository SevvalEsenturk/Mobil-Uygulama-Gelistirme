const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { getUsageStats, addUsageStat, getDailySummary } = require('../controllers/usageController');

/**
 * @swagger
 * tags:
 *   name: Usage
 *   description: Kullanım istatistikleri
 */

/**
 * @swagger
 * /api/usage/stats:
 *   get:
 *     summary: Kullanım istatistiklerini getir
 *     tags: [Usage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanım istatistikleri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UsageStat'
 */
router.get('/stats', auth, getUsageStats);

/**
 * @swagger
 * /api/usage/stats:
 *   post:
 *     summary: Kullanım verisi ekle (Sadece Child)
 *     tags: [Usage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [app_name, package_name, usage_minutes, usage_date]
 *             properties:
 *               app_name:
 *                 type: string
 *                 example: Instagram
 *               package_name:
 *                 type: string
 *                 example: com.instagram.android
 *               usage_minutes:
 *                 type: integer
 *                 example: 45
 *               usage_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *     responses:
 *       201:
 *         description: Kullanım verisi eklendi
 *       400:
 *         description: Eksik alan
 *       403:
 *         description: Yetki yok (parent rolü)
 */
router.post('/stats', auth, requireRole('child'), addUsageStat);

/**
 * @swagger
 * /api/usage/daily-summary:
 *   get:
 *     summary: Günlük kullanım özeti
 *     tags: [Usage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: "Tarih (YYYY-MM-DD). Varsayılan: bugün"
 *         example: "2024-01-15"
 *     responses:
 *       200:
 *         description: Günlük özet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                 summary:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalMinutes:
 *                   type: integer
 *                 totalApps:
 *                   type: integer
 */
router.get('/daily-summary', auth, getDailySummary);

module.exports = router;
