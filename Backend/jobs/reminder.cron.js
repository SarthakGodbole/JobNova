import cron from 'node-cron';
import Application from '../models/application.model.js';
import { sendMail } from '../config/mail.js';

const startReminderCron = () => {
  cron.schedule(
    '* * * * *',
    async () => {
      console.log('⏰ Running deadline reminder cron job (TESTING MODE)...');

      try {
        const now = new Date();
        const twoDaysLater = new Date();
        twoDaysLater.setDate(now.getDate() + 2);

        const upcomingApplications = await Application.find({
          deadline: { $gte: now, $lte: twoDaysLater },
          status: { $nin: ['Offer', 'Rejected'] },
        }).populate('user', 'name email');

        if (!upcomingApplications.length) {
          console.log('No upcoming deadlines found.');
          return;
        }

        for (const app of upcomingApplications) {
          if (!app.user || !app.user.email) continue;

          const deadlineDate = new Date(app.deadline).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h2 style="color: #4f46e5;">⏰ InternTrack – Deadline Reminder</h2>
              <p>Hi <strong>${app.user.name}</strong>,</p>
              <p>This is a friendly reminder that your application deadline is approaching.</p>

              <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
                <tr style="background:#f3f4f6;">
                  <td style="padding:8px; font-weight:bold;">Company</td>
                  <td style="padding:8px;">${app.company}</td>
                </tr>
                <tr>
                  <td style="padding:8px; font-weight:bold;">Role</td>
                  <td style="padding:8px;">${app.role}</td>
                </tr>
                <tr style="background:#f3f4f6;">
                  <td style="padding:8px; font-weight:bold;">Status</td>
                  <td style="padding:8px;">${app.status}</td>
                </tr>
                <tr>
                  <td style="padding:8px; font-weight:bold;">Deadline</td>
                  <td style="padding:8px; color:#dc2626;"><strong>${deadlineDate}</strong></td>
                </tr>
              </table>

              <p>
                Log in to 
                <a href="${process.env.CLIENT_URL}" style="color:#4f46e5;">
                  InternTrack
                </a> 
                to update your application status.
              </p>

              <p style="color:#6b7280; font-size:12px;">
                This is an automated reminder from InternTrack.
              </p>
            </div>
          `;

          await sendMail({
            to: app.user.email,
            subject: `⏰ Deadline Reminder: ${app.company} – ${app.role}`,
            html,
          });

          console.log(`📧 Reminder sent to ${app.user.email} for ${app.company}`);
        }
      } catch (error) {
        console.error('❌ Cron job error:', error.message);
      }
    },
    {
      timezone: 'Asia/Kolkata',
    }
  );

  console.log('✅ Deadline reminder cron job scheduled for daily 9:00 AM');
};

export default startReminderCron;