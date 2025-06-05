import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = 5173;

// Enable CORS
app.use(cors());
app.use(express.json());

// Create transporter for emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'sales@shadownik.online',
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Set up Google Calendar API
const setupGoogleCalendar = async () => {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  return google.calendar({ version: 'v3', auth });
};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
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
      from: '"Shadownik(SWNK) Contact Form" <support@swnk.in>',
      to: 'sales@swnk.in',
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
      from: '"Shadownik(SWNK) Web Development" <info@swnk.in>',
      to: email,
      subject: 'Thank You for Contacting Shadownik(SWNK)',
      html: `
        <h2>Thank you for contacting Shadownik(SWNK)!</h2>
        <p>Dear ${name},</p>
        
        <p>We have received your message regarding ${service}. Our team will review your request and get back to you shortly.</p>
        
        <h3>Your Message:</h3>
        <p>${message}</p>
        
        <p>In the meantime, you can:</p>
        <ul>
          <li>Check out our portfolio at <a href="https://web.swnk.in">web.swnk.in</a></li>
          <li>Follow us on social media for updates</li>
          <li>Schedule a free consultation call</li>
        </ul>
        
        <p>If you have any urgent questions, please don't hesitate to call us.</p>
        
        <p>Best regards,<br>The Shadownik(SWNK) Team</p>
      `,
    });

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Consultation booking endpoint
app.post('/api/book-consultation', async (req, res) => {
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
        { email: 'sales@shadownik.online' },
        { email: 'support@shadownik.online' },
        { email: 'info@shadownik.online' },
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
      from: '"Shadownik(Swnk) Booking System" <sales@shadownik.online>',
      to: 'support@shadownik.online',
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
      from: '"Shadownik(Swnk) Web Development" <info@shadownik.online>',
      to: email,
      subject: 'Your Consultation with Shadownik(Swnk) is Confirmed',
      html: `
        <h2>Thank you for booking a consultation with Shadownik(Swnk)!</h2>
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
        
        <p>Best regards,<br>The Shadownik(Swnk) Team</p>
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
});

app.listen(port, () => {
  console.log(`Development server running at http://localhost:${port}`);
}); 