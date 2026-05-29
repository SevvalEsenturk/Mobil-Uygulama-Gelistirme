const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getApps, getAppById, createApp, deleteApp } = require('../controllers/appCatalogController');

/**
 * @swagger
 * tags:
 *   name: AppCatalog
 *   description: Uygulama kataloğu — takip edilen mobil uygulamalar
 */

/**
 * @swagger
 * /api/app-catalog:
 *   get:
 *     summary: Uygulama kataloğunu listele
 *     tags: [AppCatalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: "Kategori filtresi (örn: social, video, messaging)"
 *     responses:
 *       200:
 *         description: Uygulama listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apps:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AppCatalog'
 */
router.get('/', auth, getApps);

/**
 * @swagger
 * /api/app-catalog/{id}:
 *   get:
 *     summary: Uygulama detayını getir
 *     tags: [AppCatalog]
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
 *         description: Uygulama detayı
 *       404:
 *         description: Uygulama bulunamadı
 */
router.get('/:id', auth, getAppById);

/**
 * @swagger
 * /api/app-catalog:
 *   post:
 *     summary: Yeni uygulama ekle
 *     tags: [AppCatalog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [app_name, package_name]
 *             properties:
 *               app_name:
 *                 type: string
 *                 example: Instagram
 *               package_name:
 *                 type: string
 *                 example: com.instagram.android
 *               category:
 *                 type: string
 *                 example: social
 *               icon_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Uygulama eklendi
 *       400:
 *         description: Eksik alan
 *       409:
 *         description: package_name zaten kayıtlı
 */
router.post('/', auth, createApp);

/**
 * @swagger
 * /api/app-catalog/{id}:
 *   delete:
 *     summary: Uygulamayı sil
 *     tags: [AppCatalog]
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
 *         description: Uygulama silindi
 *       404:
 *         description: Uygulama bulunamadı
 */
router.delete('/:id', auth, deleteApp);

module.exports = router;
