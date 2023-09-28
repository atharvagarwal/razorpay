import { instance } from "../server.js";
import crypto from "crypto";
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
  
