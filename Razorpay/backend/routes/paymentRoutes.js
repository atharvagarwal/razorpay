import express from 'express';
import {checkout,paymentVerification,processRefund,stripeCheckout,stripeWebhookHandler} from '../controller/paymentController.js'
import verifyWebhookSignature from '../middlewares/verification.js';
const router =express.Router();
router.use(express.raw({ type: "application/json" }));
router.route('/checkout').post(checkout)
router.route('/paymentverification').post(paymentVerification)
router.route('/processRefund').post(verifyWebhookSignature,processRefund)
router.route('/stripeCheckout').post(stripeCheckout)
router.post("/stripeWebhookHandler", express.raw({ type: "application/json" }),stripeWebhookHandler)
export default router;
