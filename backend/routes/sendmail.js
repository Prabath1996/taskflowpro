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

    // Check if email credentials are available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email credentials not configured");
      return res.status(500).json({ 
        success: false, 
        error: "Email service not configured. Please contact administrator." 
      });
    }

    // Configure transporter
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add timeout and connection settings
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log("Email transporter verified successfully");
    } catch (verifyError) {
      console.error("Email transporter verification failed:", verifyError);
      return res.status(500).json({ 
        success: false, 
        error: "Email service configuration error. Please check credentials." 
      });
    }

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);

    res.json({ 
      success: true, 
      message: "Email sent successfully",
      messageId: result.messageId 
    });
  } catch (error) {
    console.error("Email send error:", error);
    
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        success: false, 
        error: "Email authentication failed. Please check your email credentials and ensure you're using an App Password." 
      });
    }
    
    if (error.code === 'ECONNECTION') {
      return res.status(500).json({ 
        success: false, 
        error: "Failed to connect to email service. Please check your internet connection and try again." 
      });
    }

    if (error.code === 'ETIMEDOUT') {
      return res.status(500).json({ 
        success: false, 
        error: "Email service timeout. Please try again later." 
      });
    }

    if (error.code === 'EAUTHREQUIRED') {
      return res.status(500).json({ 
        success: false, 
        error: "Email authentication required. Please check your Gmail settings and App Password." 
      });
    }
    
    // Log the full error for debugging
    console.error("Full email error details:", {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      message: error.message
    });
    
    res.status(500).json({ 
      success: false, 
      error: "Failed to send email. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;