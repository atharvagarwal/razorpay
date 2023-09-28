import { instance } from "../server.js";
import crypto from "crypto";
import stripe from 'stripe';

const stripeInstance = stripe('sk_test_51KoYjUSDZBjXIg74HFVs8kS7SMB0v1K8pbA6TCU7meJtTx9NQslculaw8oyBx1xR6r6CBRxQQC0qKJ91xR9eCTXk00B0MFg0qZ');
export const checkout = async (req, res) => {
  try {
    var options = {
      amount: Number(req.body.amount * 100), // amount in the smallest currency unit
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    res.status(200).send({ message: "orders created successfully", order });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "orders creation failed" });
  }
};

export const paymentVerification = (req, res) => {
  // do a validation
  const secret = "123456";

  const {
    payload, // This should contain the payload data sent by Razorpay
  } = req.body;

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    // process it
    res.status(200).json({ success: true, payload: payload });
  } else {
    // pass it
    console.log("request is not legit");
    res.status(200).json({ success: false });
  }
};

// Route to initiate a refund
export const processRefund = async (req, res) => {
  try {
    const eventData = req.body;
    if (
      eventData.event === "refund.processed" ||
      eventData.event === "refund.failed" ||
      eventData.event === "refund.created"
    ) {
      const status = eventData.payload.refund.entity.status;
      const amount = Number(eventData.payload.refund.entity.amount) / 100;
      // You can store refund details in your database here
      // Send a success response to Razorpay to acknowledge receipt of the webhook event
      console.log(
        "refund processing success of amount rs ",
        amount + " with status " + status
      );
      res.send("Webhook received and processed successfully");
    } else {
      console.log("refund processing failure");
      res.status(200).send("Webhook received but not processed (not a refund event)");
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(400).send("Error processing webhook");
  }
};


//STRIPE PAYMENTS 

export const stripeCheckout=async(req,res)=>{
  const { amount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripeInstance.paymentIntents.create({
    amount: 2000*100, //replace to amount
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
}
  
