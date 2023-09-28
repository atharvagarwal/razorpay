import express from 'express';
import {checkout,paymentVerification,processRefund,stripeCheckout} from '../controller/paymentController.js'
import verifyWebhookSignature from '../middlewares/verification.js';
const router =express.Router();
router.route('/checkout').post(checkout)
router.route('/paymentverification').post(paymentVerification)
router.route('/processRefund').post(verifyWebhookSignature,processRefund)
router.route('/stripeCheckout').post(stripeCheckout)

export default router;
