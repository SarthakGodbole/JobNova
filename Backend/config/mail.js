// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: Number(process.env.MAIL_PORT),
//   secure: false,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// export const sendMail = async ({ to, subject, html }) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"InternTrack" <${process.env.MAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });

//     console.log(`Email sent to ${to}: ${info.messageId}`);
//     return info;
//   } catch (error) {
//     console.error('Mail sending failed:', error.message);
//     throw error;
//   }
// };

// export default transporter;
// import dotenv from 'dotenv';
// dotenv.config();

// import nodemailer from 'nodemailer';

// console.log('MAIL_HOST:', process.env.MAIL_HOST);
// console.log('MAIL_PORT:', process.env.MAIL_PORT);
// console.log('MAIL_USER:', process.env.MAIL_USER);
// console.log('MAIL_PASS exists:', !!process.env.MAIL_PASS);

// const transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: Number(process.env.MAIL_PORT),
//   secure: false,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// });

// export const sendMail = async ({ to, subject, html }) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"InternTrack" <${process.env.MAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });

//     console.log(`✅ Email sent to ${to}: ${info.messageId}`);
//     return info;
//   } catch (error) {
//     console.error('❌ Mail sending failed:', error.message);
//     throw error;
//   }
// };

// export default transporter;
import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

// Debug (remove later)
console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS exists:", !!process.env.MAIL_PASS);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"JobNova" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Mail sending failed:', error.message);
    throw error;
  }
};

export default transporter;