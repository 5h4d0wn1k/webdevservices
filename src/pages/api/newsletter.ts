import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

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
    console.log('Attempting to send newsletter confirmation email...');
    
    // Verify transporter configuration
    await transporter.verify();
    console.log('Transporter verified successfully');

    // Send confirmation email to subscriber
    const mail = await transporter.sendMail({
      from: `"Shadownik Newsletter" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Shadownik Newsletter!',
      html: `
        <h2>Welcome to Shadownik Newsletter!</h2>
        <p>Thank you for subscribing to our newsletter. You will now receive updates about our latest services and promotions.</p>
        <p>Best regards,<br>Team Shadownik</p>
      `,
    });

    console.log('Newsletter confirmation email sent successfully:', mail.messageId);

    return res.status(200).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Detailed newsletter email error:', error);
    return res.status(500).json({ 
      message: 'Failed to send confirmation email',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 