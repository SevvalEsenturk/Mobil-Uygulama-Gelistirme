const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getNotifications, markAsRead } = require('../controllers/notificationController');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Bildirim işlemleri
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Bildirimleri listele
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bildirim listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 unreadCount:
 *                   type: integer
 */
router.get('/', auth, getNotifications);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Bildirimi okundu olarak işaretle
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bildirim ID
 *     responses:
 *       200:
 *         description: Bildirim okundu olarak işaretlendi
 *       404:
 *         description: Bildirim bulunamadı
 */
router.put('/:id/read', auth, markAsRead);

module.exports = router;
