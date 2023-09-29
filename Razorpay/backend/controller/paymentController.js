import { instance } from "../server.js";
import crypto from "crypto";
import stripe from "stripe";

const stripeInstance = stripe(
  "sk_test_51KoYjUSDZBjXIg74HFVs8kS7SMB0v1K8pbA6TCU7meJtTx9NQslculaw8oyBx1xR6r6CBRxQQC0qKJ91xR9eCTXk00B0MFg0qZ"
);
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
      res
        .status(200)
        .send("Webhook received but not processed (not a refund event)");
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(400).send("Error processing webhook");
  }
};

//STRIPE PAYMENTS

export const stripeCheckout = async (req, res) => {
  const { amount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripeInstance.paymentIntents.create({
    amount: 2000 * 100, //replace to amount
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

// stripe webhook handler

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_CoL8ou2pBIYrQ4Jx8IJhm2ijqTLQmSSk";

export const stripeWebhookHandler = (request, response) => {
  try {
    // Retrieve the raw request body as a Buffer
    const sig = request.headers["stripe-signature"];
    const jsonData = request.body;
    const event = stripeInstance.webhooks.constructEvent(
      jsonData,
      sig,
      endpointSecret
    );

    // Handle the event
    switch (event.type) {
      case "payment_intent.amount_capturable_updated":
        const paymentIntentAmountCapturableUpdated = event.data.object;
        console.log("payment captured", paymentIntentAmountCapturable);
        // Then define and call a function to handle the event payment_intent.amount_capturable_updated
        break;
      case "payment_intent.partially_funded":
        const paymentIntentPartiallyFunded = event.data.object;
        // Then define and call a function to handle the event payment_intent.partially_funded
        console.log("payment partially funded", paymentIntentPartiallyFunded);
        break;
      case "payment_intent.payment_failed":
        const paymentIntentPaymentFailed = event.data.object;
        console.log("payment intent failed", paymentIntentPaymentFailed);

        // Then define and call a function to handle the event payment_intent.payment_failed
        break;
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log("payment intent success");
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      case "refund.created":
        const refundCreated = event.data.object;
        console.log("payment refund created", refundCreated);
        // Then define and call a function to handle the event refund.created
        break;
      case "refund.updated":
        const refundUpdated = event.data.object;
        console.log("payment refund updated", refundUpdated);
        // Then define and call a function to handle the event refund.updated
        break;
      case "charge.refunded":
        const chargeUpdated = event.data.object;
        console.log("payment refund updated", chargeUpdated);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Return a 200 response to acknowledge receipt of the event
  response.status(200).json({ success: true });
};
