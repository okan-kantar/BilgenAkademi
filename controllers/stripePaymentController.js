const path = require('path');
const stripe = require('../config/stripe');
const Product = require('../models/Product');
const Order = require('../models/Order');

const getBaseUrl = () => {
    return (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
};

const getPaymentPagePath = (pageName) => {
    return path.join(__dirname, '..', 'views', pageName);
};

const createCheckoutSession = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res
                .status(400)
                .json({ success: false, message: 'Ürün ID zorunludur' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: 'Ürün bulunamadı' });
        }

        if (!product.inStock) {
            return res
                .status(400)
                .json({ success: false, message: 'Ürün stokta yok' });
        }

        const totalPrice = (product.price * quantity).toFixed(2);

        const order = await Order.create({
            user: userId,
            product: productId,
            quantity,
            totalPrice,
            paymentStatus: 'pending',
            paymentProvider: 'stripe',
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'try',
                        product_data: {
                            name: product.name,
                            description: product.description || undefined,
                        },
                        unit_amount: Math.round(product.price * 100),
                    },
                    quantity,
                },
            ],
            metadata: {
                orderId: order._id.toString(),
            },
            success_url: `${getBaseUrl()}/api/stripe-payments/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${getBaseUrl()}/api/stripe-payments/failure`,
        });

        await Order.findByIdAndUpdate(order._id, {
            stripeSessionId: session.id,
        });

        return res.status(200).json({
            success: true,
            message: 'Stripe ödeme oturumu oluşturuldu',
            data: {
                orderId: order._id,
                sessionId: session.id,
                checkoutUrl: session.url,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const handleCheckoutSuccess = async (req, res) => {
    try {
        const { session_id: sessionId } = req.query;

        if (!sessionId) {
            return res.redirect(303, '/api/stripe-payments/failure');
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        const orderId = session.metadata?.orderId;
        const isPaymentSuccessful = session.payment_status === 'paid';

        if (orderId) {
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: isPaymentSuccessful ? 'success' : 'failure',
                stripePaymentIntentId: session.payment_intent || null,
            });
        }

        if (isPaymentSuccessful) {
            return res.sendFile(getPaymentPagePath('payment-success.html'));
        }

        return res.redirect(303, '/api/stripe-payments/failure');
    } catch (error) {
        return res.redirect(303, '/api/stripe-payments/failure');
    }
};

const getPaymentFailurePage = (req, res) => {
    return res.sendFile(getPaymentPagePath('payment-failure.html'));
};

module.exports = {
    createCheckoutSession,
    handleCheckoutSuccess,
    getPaymentFailurePage,
};
