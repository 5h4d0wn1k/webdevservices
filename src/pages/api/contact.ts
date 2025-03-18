import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, service, message } = req.body;

  // Create email transporter with secure configuration
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    console.log('Attempting to send email...');
    
    // Verify transporter configuration
    await transporter.verify();
    console.log('Transporter verified successfully');

    // Send email to admin
    const adminMail = await transporter.sendMail({
      from: `"Shadownik Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    console.log('Admin email sent successfully:', adminMail.messageId);

    // Send confirmation email to client
    const clientMail = await transporter.sendMail({
      from: `"Shadownik Contact" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting Shadownik',
      html: `
        <h2>Thank you for contacting Shadownik!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you shortly.</p>
        <p>Best regards,<br>Team Shadownik</p>
      `,
    });

    console.log('Client email sent successfully:', clientMail.messageId);

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Detailed email error:', error);
    return res.status(500).json({ 
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 