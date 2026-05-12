import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import applicationRoutes from './routes/application.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { sendMail } from './config/mail.js';

dotenv.config();

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'InternTrack API is running 🚀' });
});

// Test API Endpoint for Nodemailer
app.post('/api/test-mail', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address in the request body.' });
    }

    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
       console.error("❌ ERROR: MAIL_USER or MAIL_PASS is missing in your .env file.");
       return res.status(500).json({ success: false, message: 'Mail credentials missing in .env' });
    }

    console.log(`\n⏳ Validating SMTP and sending test email to: ${email}...`);
    
    const info = await sendMail({
      to: email,
      subject: '🧪 InternTrack System Test',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4f46e5;">✅ System Test Successful!</h2>
          <p>Your Nodemailer configuration in InternTrack is working perfectly.</p>
        </div>
      `
    });

    console.log(`✅ Email sent successfully! Message ID: ${info.messageId}\n`);
    res.status(200).json({ 
      success: true, 
      message: 'Test email delivered successfully!', 
      messageId: info.messageId 
    });

  } catch (error) {
    console.error('❌ Failed to send test email:', error.message, '\n');
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email. Check your server console.', 
      error: error.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
