const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { syncChildApps, getChildApps } = require('../controllers/childAppsController');

/**
 * @swagger
 * tags:
 *   name: ChildApps
 *   description: Çocuğun cihazındaki yüklü uygulamaların yönetimi
 */

/**
 * @swagger
 * /api/users/child-apps:
 *   post:
 *     summary: Çocuğun cihazındaki yüklü uygulamaları senkronize et (Sadece Child)
 *     tags: [ChildApps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [apps]
 *             properties:
 *               apps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [app_name, package_name]
 *                   properties:
 *                     app_name:
 *                       type: string
 *                       example: WhatsApp
 *                     package_name:
 *                       type: string
 *                       example: com.whatsapp
 *                     icon_url:
 *                       type: string
 *                       example: ""
 *     responses:
 *       201:
 *         description: Başarıyla senkronize edildi
 *       401:
 *         description: Token gerekli
 *       403:
 *         description: Yetkisiz rol
 */
router.post('/child-apps', auth, requireRole('child'), syncChildApps);

/**
 * @swagger
 * /api/users/{childId}/child-apps:
 *   get:
 *     summary: Çocuğun cihazındaki yüklü uygulamaları listele
 *     tags: [ChildApps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: childId
 *         required: true
 *         schema:
 *           type: string
 *         description: İlişkisel Çocuk ID (users table ID'si değil, children table ID'sidir)
 *     responses:
 *       200:
 *         description: Yüklü uygulama listesi
 *       401:
 *         description: Token gerekli
 *       403:
 *         description: Yetkisiz erişim
 */
router.get('/:childId/child-apps', auth, getChildApps);

module.exports = router;
