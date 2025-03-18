import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Create transporter for emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'shadownik.official@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, service, message } = req.body;

    // Validate required fields
    if (!name || !email || !service || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Send notification to admin
    await transporter.sendMail({
      from: '"Shadownik Contact Form" <info@shadownik.online>',
      to: 'nikhilnagpure203@gmail.com',
      subject: `New Contact Form Submission - ${service}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <h3>Client Information:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        
        <h3>Message:</h3>
        <p>${message}</p>
      `,
    });

    // Send confirmation to client
    await transporter.sendMail({
      from: '"Shadownik Web Development" <info@shadownik.online>',
      to: email,
      subject: 'Thank You for Contacting Shadownik',
      html: `
        <h2>Thank you for contacting Shadownik!</h2>
        <p>Dear ${name},</p>
        
        <p>We have received your message regarding ${service}. Our team will review your request and get back to you shortly.</p>
        
        <h3>Your Message:</h3>
        <p>${message}</p>
        
        <p>In the meantime, you can:</p>
        <ul>
          <li>Check out our portfolio at <a href="https://shadownik.online">shadownik.online</a></li>
          <li>Follow us on social media for updates</li>
          <li>Schedule a free consultation call</li>
        </ul>
        
        <p>If you have any urgent questions, please don't hesitate to call us.</p>
        
        <p>Best regards,<br>The Shadownik Team</p>
      `,
    });

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
} 