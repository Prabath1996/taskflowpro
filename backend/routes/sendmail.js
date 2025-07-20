const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/send", async (req, res) => {
  const { to, subject, text, html } = req.body;
  
  try {
    // validate required fields
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required fields: to, subject, and content (text or html)" 
      });
    }

    // Check if email credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ 
        success: false, 
        error: "Email service not configured" 
      });
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add timeout to prevent hanging
      connectionTimeout: 30000,
      greetingTimeout: 30000,
    });

    // Test connection
    try {
      await transporter.verify();
      console.log("Email connection verified");
    } catch (verifyError) {
      console.error("Email verification failed:", verifyError.message);
      return res.status(500).json({ 
        success: false, 
        error: "Email service connection failed. Please check your credentials." 
      });
    }

    // Send email
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully:", result.messageId);
    res.json({ 
      success: true, 
      message: "Email sent successfully",
      messageId: result.messageId 
    });

  } catch (error) {
    console.error("Email send error:", error);
    
    // Provide specific error messages
    let errorMessage = "Failed to send email";
    
    if (error.code === 'EAUTH') {
      errorMessage = "Email authentication failed. Please check your Gmail credentials.";
    } else if (error.code === 'ECONNECTION') {
      errorMessage = "Failed to connect to email service. Please check your internet connection.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
});

// debug endpoint to check email configuration
router.get("/test", (req, res) => {
  res.json({
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
    emailUser: process.env.EMAIL_USER ? "Set" : "Not set",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;