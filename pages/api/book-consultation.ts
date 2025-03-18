import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

// Set up Google Calendar API
const setupGoogleCalendar = async () => {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  return google.calendar({ version: 'v3', auth });
};

// Create transporter for emails
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@shadownik.online',
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
    const { name, email, phone, date, time, projectType, budget, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !date || !time || !projectType || !budget || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Format date for email and calendar
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Parse the date and time to create Google Calendar event
    const timeString = time.split(' ')[0]; // Assuming time format like "10:00 AM"
    const [hours, minutes] = timeString.split(':');
    let hour = parseInt(hours);
    if (time.includes('PM') && hour < 12) hour += 12;
    if (time.includes('AM') && hour === 12) hour = 0;

    const startDate = new Date(date);
    startDate.setHours(hour, parseInt(minutes), 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 30); // 30-minute consultation

    // Create Google Calendar event
    const calendar = await setupGoogleCalendar();
    const event = {
      summary: `Consultation with ${name} - ${projectType}`,
      description: `
Project Type: ${projectType}
Budget: ${budget}
Phone: ${phone}
Details: ${message}
      `,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      attendees: [
        { email: 'nikhilnagpure203@gmail.com' },
        { email },
      ],
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const calendarEvent = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    });

    const meetLink = calendarEvent.data.hangoutLink || 'Link will be sent separately';

    // Send notification to admin
    await transporter.sendMail({
      from: '"Shadownik Booking System" <info@shadownik.online>',
      to: 'nikhilnagpure203@gmail.com',
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
        <p><strong>Google Meet Link:</strong> <a href="${meetLink}">${meetLink}</a></p>
        
        <h3>Project Details:</h3>
        <p>${message}</p>
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
        
        <p><strong>Google Meet Link:</strong> <a href="${meetLink}">${meetLink}</a></p>
        
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
        
        <p>If you need to reschedule or have any questions, please reply to this email or call us.</p>
        
        <p>Best regards,<br>The Shadownik Team</p>
      `,
    });

    res.status(200).json({ 
      message: 'Consultation booked successfully',
      meetLink
    });
  } catch (error) {
    console.error('Error booking consultation:', error);
    res.status(500).json({ message: 'Error booking consultation' });
  }
} 