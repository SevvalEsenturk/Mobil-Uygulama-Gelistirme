const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const {
  getBlockRules, createBlockRule, deleteBlockRule,
  getTimeRestrictions, createTimeRestriction, updateTimeRestriction, deleteTimeRestriction,
} = require('../controllers/rulesController');

/**
 * @swagger
 * tags:
 *   name: Rules
 *   description: Engelleme kuralları ve zaman kısıtlamaları
 */

/**
 * @swagger
 * /api/rules/block:
 *   get:
 *     summary: Engelleme kurallarını listele
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Engelleme kuralları listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rules:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlockRule'
 */
router.get('/block', auth, getBlockRules);

/**
 * @swagger
 * /api/rules/block:
 *   post:
 *     summary: Yeni engelleme kuralı oluştur (Sadece Parent)
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [child_id, app_name, package_name]
 *             properties:
 *               child_id:
 *                 type: string
 *                 description: Children tablosundaki ID
 *               app_name:
 *                 type: string
 *                 example: TikTok
 *               package_name:
 *                 type: string
 *                 example: com.tiktok.android
 *               is_blocked:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Kural oluşturuldu
 *       400:
 *         description: Eksik alan
 *       403:
 *         description: Yetki yok (child rolü)
 */
router.post('/block', auth, requireRole('parent'), createBlockRule);

/**
 * @swagger
 * /api/rules/block/{id}:
 *   delete:
 *     summary: Engelleme kuralını sil (Sadece Parent)
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kural silindi
 *       404:
 *         description: Kural bulunamadı
 */
router.delete('/block/:id', auth, requireRole('parent'), deleteBlockRule);

/**
 * @swagger
 * /api/rules/time-restrictions:
 *   get:
 *     summary: Zaman kısıtlamalarını listele
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Zaman kısıtlamaları listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restrictions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TimeRestriction'
 */
router.get('/time-restrictions', auth, getTimeRestrictions);

/**
 * @swagger
 * /api/rules/time-restrictions:
 *   post:
 *     summary: Yeni zaman kısıtlaması oluştur (Sadece Parent)
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [child_id, app_name, package_name, day_of_week, start_time, end_time]
 *             properties:
 *               child_id:
 *                 type: string
 *               app_name:
 *                 type: string
 *                 example: Instagram
 *               package_name:
 *                 type: string
 *                 example: com.instagram.android
 *               day_of_week:
 *                 type: string
 *                 example: Pazartesi-Cuma
 *               start_time:
 *                 type: string
 *                 example: "09:00"
 *               end_time:
 *                 type: string
 *                 example: "17:00"
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Kısıtlama oluşturuldu
 *       400:
 *         description: Eksik alan
 */
router.post('/time-restrictions', auth, requireRole('parent'), createTimeRestriction);

/**
 * @swagger
 * /api/rules/time-restrictions/{id}:
 *   put:
 *     summary: Zaman kısıtlamasını güncelle (Sadece Parent)
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               app_name:
 *                 type: string
 *               package_name:
 *                 type: string
 *               day_of_week:
 *                 type: string
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Kısıtlama güncellendi
 *       404:
 *         description: Kısıtlama bulunamadı
 */
router.put('/time-restrictions/:id', auth, requireRole('parent'), updateTimeRestriction);

/**
 * @swagger
 * /api/rules/time-restrictions/{id}:
 *   delete:
 *     summary: Zaman kısıtlamasını sil (Sadece Parent)
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kısıtlama silindi
 *       404:
 *         description: Kısıtlama bulunamadı
 */
router.delete('/time-restrictions/:id', auth, requireRole('parent'), deleteTimeRestriction);

module.exports = router;
