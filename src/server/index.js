import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com', // Replace with your SMTP host
  port: 465,
  secure: true,
  auth: {
    user: 'info@shadownik.online',
    pass: process.env.EMAIL_PASSWORD, // Store this in environment variables
  },
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, service, message } = req.body;

    // Validate the input
    if (!name || !email || !service || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

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
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 