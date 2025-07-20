const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/send", async (req, res) => {
  const { to, subject, text, html } = req.body;
  
  try {
    // Validate required fields
    if (!to) {
      return res.status(400).json({ 
        success: false, 
        error: "Recipient email is required" 
      });
    }
    
    if (!subject) {
      return res.status(400).json({ 
        success: false, 
        error: "Email subject is required" 
      });
    }
    
    if (!text && !html) {
      return res.status(400).json({ 
        success: false, 
        error: "Email content (text or html) is required" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid recipient email format" 
      });
    }

    // Configure transporter
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        success: false, 
        error: "Email authentication failed. Please check your email credentials." 
      });
    }
    
    if (error.code === 'ECONNECTION') {
      return res.status(500).json({ 
        success: false, 
        error: "Failed to connect to email service. Please try again later." 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: "Failed to send email. Please try again later." 
    });
  }
});

module.exports = router;