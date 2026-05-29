const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { getPermissionLogs, createPermissionLog, getLatestPermissions } = require('../controllers/permissionLogController');

/**
 * @swagger
 * tags:
 *   name: PermissionLogs
 *   description: Cihaz izin durumu logları (Usage Access, Notification, Accessibility vb.)
 */

/**
 * @swagger
 * /api/permission-logs:
 *   get:
 *     summary: İzin loglarını listele
 *     tags: [PermissionLogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: İzin logları listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PermissionLog'
 */
router.get('/', auth, getPermissionLogs);

/**
 * @swagger
 * /api/permission-logs:
 *   post:
 *     summary: İzin durumu kaydet (Sadece Child)
 *     tags: [PermissionLogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [device_id, permission_type]
 *             properties:
 *               device_id:
 *                 type: string
 *                 description: Devices tablosundaki cihaz ID
 *               permission_type:
 *                 type: string
 *                 enum: [usage_access, notification, accessibility, overlay, device_admin, battery_optimization]
 *                 example: usage_access
 *               is_granted:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: İzin durumu kaydedildi
 *       400:
 *         description: Eksik veya geçersiz alan
 *       403:
 *         description: Yetki yok (parent rolü)
 *       404:
 *         description: Cihaz bulunamadı
 */
router.post('/', auth, requireRole('child'), createPermissionLog);

/**
 * @swagger
 * /api/permission-logs/device/{deviceId}/latest:
 *   get:
 *     summary: Cihazın güncel izin durumlarını getir
 *     tags: [PermissionLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Devices tablosundaki cihaz ID
 *     responses:
 *       200:
 *         description: Her izin türü için en son durum
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 device_id:
 *                   type: string
 *                 permissions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PermissionLog'
 */
router.get('/device/:deviceId/latest', auth, getLatestPermissions);

module.exports = router;
