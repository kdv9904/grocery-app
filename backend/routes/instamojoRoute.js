import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/pay', async (req, res) => {
  const { amount, buyer_name, email, phone } = req.body;

  try {
    const response = await axios.post(
      'https://test.instamojo.com/api/1.1/payment_requests/',
      {
        purpose: 'Grocery Payment',
        amount,
        buyer_name,
        email,
        phone,
        redirect_url: 'http://localhost:3000/payment-success',
        send_email: true,
        send_sms: true,
        allow_repeated_payments: false,
      },
      {
        headers: {
          'X-Api-Key': process.env.INSTAMOJO_API_KEY,
          'X-Auth-Token': process.env.INSTAMOJO_AUTH_TOKEN,
          'Content-Type': 'application/json'
        },
      }
    );

    res.status(200).json({ success: true, link: response.data.payment_request.longurl });
  } catch (error) {
    console.error("Instamojo Error:", error?.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Payment link generation failed. Check API keys and payload.',
    });
  }
});

export default router;
