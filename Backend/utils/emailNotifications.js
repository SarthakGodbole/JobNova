import { sendMail } from '../config/mail.js';

export const sendNotificationEmail = async (to, subject, html) => {
  try {
    if (!to || !subject || !html) {
      console.warn("Mail skipped: Missing parameters for notification email.");
      return;
    }
    // Asynchronous sendMail off the main execution block (fire and forget pattern within Express)
    sendMail({ to, subject, html }).catch(err => {
      console.error("Non-blocking mail sending failed:", err.message);
    });
  } catch (error) {
    console.error("Error setting up notification email:", error.message);
  }
};
