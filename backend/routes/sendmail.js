const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/send", async (req, res) => {
  const { to, subject, text ,html } = req.body;
  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;