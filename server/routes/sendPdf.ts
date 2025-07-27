import express, { Request, Response } from 'express';
import multer from 'multer';
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../uploads/') });

interface SendDashboardImageRequest extends Request {
  body: {
    userEmail: string;
    username: string;
    date: string;
    shift: string;
  };
  file?: Express.Multer.File;
}

router.post(
  '/send-dashboard-image',
  upload.single('image'),
  async (req: SendDashboardImageRequest, res: Response) => {
    try {
      const imagePath = req.file?.path;
      const { userEmail, username, date, shift } = req.body;

      if (!imagePath) {
        return res.status(400).json({ success: false, error: 'No image uploaded' });
      }

      const transporter: Transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'your.email@gmail.com',
          pass: process.env.EMAIL_PASSWORD || 'your-app-password',
        },
      });

      const mailOptions: SendMailOptions = {
        from: process.env.EMAIL_USER || 'your.email@gmail.com',
        to: ['manager@target.com', 'team@target.com'],
        subject: `3868 Pass Down Report - ${shift} Shift ${date}`,
        html: `
          <h2>3868 Pass Down Dashboard Report</h2>
          <p><strong>Submitted by:</strong> ${username}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Shift:</strong> ${shift}</p>
          <p><strong>User Email:</strong> ${userEmail}</p>
          <p>Please find the dashboard screenshot attached.</p>
        `,
        attachments: [
          {
            filename: `dashboard-${date}-${shift}.png`,
            path: imagePath,
            contentType: 'image/png',
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      fs.unlinkSync(imagePath);

      res.json({ success: true, message: 'Dashboard sent successfully!' });
    } catch (err) {
      console.error('Email send error:', err);
      res.status(500).json({ success: false, error: 'Failed to send email' });
    }
  }
);

export default router;