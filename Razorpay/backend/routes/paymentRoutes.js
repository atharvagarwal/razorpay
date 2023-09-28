import express from 'express';
import {checkout,paymentVerification,processRefund} from '../controller/paymentController.js'
import verifyWebhookSignature from '../middlewares/verification.js';
const router =express.Router();
router.route('/checkout').post(checkout)
router.route('/paymentverification').post(paymentVerification)
router.route('/processRefund').post(verifyWebhookSignature,processRefund)

export default router;
