import nodemailer from 'nodemailer';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, service, message } = req.body;

    // Validate the input
    if (!name || !email || !service || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: 'info@shadownik.online',
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email
    await transporter.sendMail({
      from: '"Shadownik Contact Form" <info@shadownik.online>',
      to: 'info@shadownik.online',
      subject: `New Contact Form Submission - ${service}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Send auto-reply to the user
    await transporter.sendMail({
      from: '"Shadownik Web Development" <info@shadownik.online>',
      to: email,
      subject: 'Thank you for contacting Shadownik',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message regarding ${service}. Our team will review your inquiry and get back to you within 24 hours.</p>
        <p>Here's a copy of your message:</p>
        <blockquote>${message}</blockquote>
        <p>Best regards,<br>The Shadownik Team</p>
      `,
    });

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
} 