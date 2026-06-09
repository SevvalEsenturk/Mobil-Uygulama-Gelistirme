const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, getChildren, updateProfile, updatePassword, deleteProfile, deleteChild } = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Kullanıcı işlemleri
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Kullanıcı profilini getir
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı profil bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token gerekli
 */
router.get('/profile', auth, getProfile);

/**
 * @swagger
 * /api/users/{parentId}/children:
 *   get:
 *     summary: Ebeveynin çocuklarını listele
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: parentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ebeveyn kullanıcı ID
 *     responses:
 *       200:
 *         description: Çocuk listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 children:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Child'
 *       401:
 *         description: Token gerekli
 *       403:
 *         description: Yetki yok
 */
router.get('/:parentId/children', auth, getChildren);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Kullanıcı profilini güncelle
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmet Yılmaz
 *               email:
 *                 type: string
 *                 example: parent@test.com
 *     responses:
 *       200:
 *         description: Profil güncellendi
 *       400:
 *         description: Eksik alanlar
 *       409:
 *         description: E-posta kullanımda
 */
/**
 * @swagger
 * /api/users/profile/password:
 *   put:
 *     summary: Kullanıcı şifresini güncelle
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: 123456
 *               newPassword:
 *                 type: string
 *                 example: 654321
 *     responses:
 *       200:
 *         description: Şifre değiştirildi
 *       400:
 *         description: Eksik alanlar
 *       401:
 *         description: Eski şifre hatalı
 */
router.put('/profile/password', auth, updatePassword);

// Hesap silme
router.delete('/profile', auth, deleteProfile);

// Çocuk silme
router.delete('/children/:childId', auth, deleteChild);

module.exports = router;
