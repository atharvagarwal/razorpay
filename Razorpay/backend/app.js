import express from 'express';
import {config} from "dotenv"
config({path:"./config/config.env"})
import paymentRoute from './routes/paymentRoutes.js'
import { stripeWebhookHandler } from './controller/paymentController.js';
import cors from 'cors';
export const app =express();
app.use(cors());
app.post("/api/stripeWebhookHandler", express.raw({ type: "application/json" }),stripeWebhookHandler)
app.use(express.json());


app.use('/api',paymentRoute);
app.get('/api/getKey',(req,res)=>{
    res.status(200).json({key:process.env.RAZORPAY_API_KEY});
})
