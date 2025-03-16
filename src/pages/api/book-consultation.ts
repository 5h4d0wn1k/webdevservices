import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@shadownik.online',
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, date, time, projectType, budget, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !date || !time || !projectType || !budget || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Format date for email
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send notification to admin
    await transporter.sendMail({
      from: '"Shadownik Booking System" <info@shadownik.online>',
      to: 'info@shadownik.online',
      subject: `New Consultation Booking - ${projectType}`,
      html: `
        <h2>New Consultation Booking</h2>
        <h3>Client Information:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        
        <h3>Consultation Details:</h3>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Budget Range:</strong> ${budget}</p>
        
        <h3>Project Details:</h3>
        <p>${message}</p>
        
        <p style="margin-top: 20px;">
          <a href="https://calendar.google.com/calendar/r/eventedit?text=Consultation+with+${encodeURIComponent(name)}&details=${encodeURIComponent(message)}&dates=${encodeURIComponent(date)}">
            Add to Calendar
          </a>
        </p>
      `,
    });

    // Send confirmation to client
    await transporter.sendMail({
      from: '"Shadownik Web Development" <info@shadownik.online>',
      to: email,
      subject: 'Your Consultation with Shadownik is Confirmed',
      html: `
        <h2>Thank you for booking a consultation with Shadownik!</h2>
        <p>Dear ${name},</p>
        
        <p>Your consultation has been confirmed for:</p>
        <p>
          <strong>Date:</strong> ${formattedDate}<br>
          <strong>Time:</strong> ${time}
        </p>
        
        <h3>Consultation Details:</h3>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Budget Range:</strong> ${budget}</p>
        
        <h3>What to Expect:</h3>
        <ul>
          <li>30-minute video consultation with our expert team</li>
          <li>Discussion of your project requirements and goals</li>
          <li>Technical recommendations and solution proposals</li>
          <li>Cost estimates and timeline overview</li>
        </ul>
        
        <p>Before the consultation, please:</p>
        <ul>
          <li>Prepare any specific questions you have</li>
          <li>Gather examples of websites/apps you like</li>
          <li>Have a rough idea of your project timeline</li>
        </ul>
        
        <p>We'll send you a calendar invite with the video call link shortly.</p>
        
        <p>If you need to reschedule or have any questions, please reply to this email or call us at +1-555-123-4567.</p>
        
        <p>Best regards,<br>The Shadownik Team</p>
      `,
    });

    res.status(200).json({ message: 'Consultation booked successfully' });
  } catch (error) {
    console.error('Error booking consultation:', error);
    res.status(500).json({ message: 'Error booking consultation' });
  }
} 