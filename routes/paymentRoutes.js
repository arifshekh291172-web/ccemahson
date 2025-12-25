const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Admission = require("../models/Admission");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* =========================
   CREATE RAZORPAY ORDER
========================= */
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // INR → paise
      currency: "INR",
      receipt: "rcpt_" + Date.now()
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: "Order creation failed" });
  }
});

/* =========================
   VERIFY PAYMENT
========================= */
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      student,
      course,
      admission
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expected !== razorpay_signature)
      return res.status(400).json({ msg: "Invalid signature" });

    // Save payment
    await Payment.create({
      student,
      course,
      amount: 1000,
      method: "ONLINE",
      status: "SUCCESS",
      transactionId: razorpay_payment_id,
      paidAt: new Date()
    });

    // Approve admission
    await Admission.findByIdAndUpdate(admission, {
      status: "APPROVED"
    });

    res.json({ msg: "Payment verified & admission approved" });
  } catch (err) {
    res.status(500).json({ msg: "Verification failed" });
  }
});

module.exports = router;
