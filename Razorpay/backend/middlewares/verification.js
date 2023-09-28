import crypto from 'crypto';
export default function verifyWebhookSignature(req, res, next) {
    const signature = req.get('X-Razorpay-Signature');
    const webhookSecret = "123456"
    try {
      const event = req.body;
      const generatedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(event))
        .digest('hex');
  
      if (signature === generatedSignature) {
        next(); // Signature is valid, continue processing
      } else {
        console.error('Invalid Razorpay webhook signature');
        res.status(400).send('Invalid Razorpay webhook signature');
      }
    } catch (error) {
      console.error('Error verifying Razorpay webhook signature:', error);
      res.status(500).send('Error verifying Razorpay webhook signature');
    }
  }
  