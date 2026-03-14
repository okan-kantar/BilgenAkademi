const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../middleware/auth');
const {
  createCheckoutSession,
  handleCheckoutSuccess,
  getPaymentFailurePage,
} = require('../controllers/stripePaymentController');

/**
 * @swagger
 * /api/stripe-payments/checkout:
 *   post:
 *     summary: Stripe checkout oturumu oluşturur
 *     tags: [Stripe Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Satın alınacak ürün ID'si
 *               quantity:
 *                 type: number
 *                 default: 1
 *                 description: Ürün adedi
 *     responses:
 *       200:
 *         description: Stripe checkout oturumu başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz istek
 *       404:
 *         description: Ürün bulunamadı
 */
router.post('/checkout', verifyAccessToken, createCheckoutSession);
router.get('/success', handleCheckoutSuccess);
router.get('/failure', getPaymentFailurePage);

module.exports = router;
