import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, date, time, projectType, budget, message } = req.body;

  // Create email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    // Create Google Meet event
    const eventStartTime = new Date(date);
    const [hours, minutes] = time.split(':');
    eventStartTime.setHours(parseInt(hours), parseInt(minutes), 0);

    const eventEndTime = new Date(eventStartTime);
    eventEndTime.setMinutes(eventEndTime.getMinutes() + 30);

    const event = {
      summary: `Consultation with ${name}`,
      description: `
        Project Type: ${projectType}
        Budget: ${budget}
        Message: ${message}
      `,
      start: {
        dateTime: eventStartTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: eventEndTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      attendees: [
        { email: process.env.GMAIL_USER }, // Admin
        { email: email }, // Client
      ],
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    });

    const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri;

    // Send confirmation email to admin
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `New Consultation Booking with ${name}`,
      html: `
        <h2>New Consultation Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Meet Link:</strong> <a href="${meetLink}">${meetLink}</a></p>
      `,
    });

    // Send confirmation email to client
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your Consultation is Scheduled - Shadownik',
      html: `
        <h2>Your Consultation is Scheduled!</h2>
        <p>Dear ${name},</p>
        <p>Your consultation with Shadownik has been scheduled for:</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Meet Link:</strong> <a href="${meetLink}">${meetLink}</a></p>
        <p>We look forward to meeting you!</p>
        <p>Best regards,<br>Team Shadownik</p>
      `,
    });

    return res.status(200).json({ 
      message: 'Consultation booked successfully',
      meetLink 
    });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ message: 'Failed to book consultation' });
  }
} 