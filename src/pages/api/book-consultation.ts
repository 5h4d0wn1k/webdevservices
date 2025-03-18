import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, date, time, projectType, budget, message } = req.body;

  // Create email transporter with secure configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports like 587
    auth: {
      user: 'shadownik.official@gmail.com',
      pass: 'ShadownikOfficial@24Google',
    },
  });

  try {
    console.log('Setting up email and calendar...');
    
    // Verify transporter configuration
    await transporter.verify();
    console.log('Transporter verified successfully');

    // Create JWT client for Google Calendar
    const auth = new JWT({
      email: 'shadownik-calender@web-dev-services-454105.iam.gserviceaccount.com',
      key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCSj53CADluZ+8+\nO+TGxFirGPdyOqMj7w6FmZ0kSYqeShQV7QDJkBml6rmDvQ+V+KHjo2QYPqYZr9Q2\n4kU/cNOJYN5qaAqV0Cde1EDm1LkDXpEmPklJzEHJkF+k44L31I4b6TdyOp0B5Ujz\nWC19QwKibKIth1lLXoS3YqbSn3oIzcd+FjNm4r1HvIuGiGf0Dvxzwc0aFy+/iKGs\n1kL5bSZImnPV9aDo4P+QDVG+fmGrSAzeBdGzY6buxGhBDK9VSL2t6dm4X6XD01Uv\n3RTcVbQ8SOmNI3FN0ZPyLqBC+vL5Kz7oYHTYoj4OAV4Z2TwCuUlEaxdpySriJX7U\neVboSVRpAgMBAAECggEAHz3B8SK/G0vIccmuoLgl9oLh7FWXhQdmXxA5sQyEIe3E\njk/xBQZUkUuRtAVPFzbiu3WO1qQ0H/GdGP3uqPFSBkzB3IjFCN5QJiS0mP/rWE6G\nPlK0qKiDtYWy/aEJv+5tRIHYMd9QrKDFhinbuIHaQ+lIQNBDNo+1VqoOyYL5Lnrs\nU9uwX99qah38QDJbc9gWmMraT6t/QoisAw3j8pv4Tw6oUmpeiKc35M1HbmVAu3Ff\nr1ByE2x+9vgA+acu/6nsAxzl1SGT9Lg5Vui26EE3Vn8NjK9W1RZOU4SUj5Y0oSd7\nVzRI0N83TsHD/rcI+G5oPvCTg+WPC/Zn8N3wzNq8yQKBgQDIob2DOU+NqP2PCT6Z\ng1/U4RXxwu0eWP2FFp2XFDpVrHRJ4/ZVEuN6ZKzmU01CaRDyXjHV6WBbzmGYmirP\nTb41C70H0pbejtOYAumFacHuIBSZBTaTRbLRURAgsNZrNFcqhfB6MipP6tBfL2za\nV0XLtuzmohxfwiNJpIHXtqALcwKBgQC7AeAtyRWnlYC/dsDjeTtn6gStFCKTB+oZ\nLvGNW1KlmckoWYVOySrYnvxcZfA7IvNtUM3DpM179D3edvpYaLhQwo6VrmFeYfcW\np29B4OQw/JrcPtQ18nnPPXzoPXecoml+EgjFvkDztXEVMKmXvPsxXpDfqjmx/e8m\nzBkJpJqhswKBgERn6R65xqcNLE69nytmQKFrkTjZ9lD3lJDxEhA15GHbp9adtBpz\nkz3i35S0aE4xVobcmO9PX/xNVLdcMSZ3YlfhxbTKF4iQeBKHQ6mqUmXnaD54KZBz\nHjICCpaq1KC+us2T11dCjWysKhmaKOoVAYYgu4szUKtRnQh53492BAGDAoGACGi+\nLvDi42VKo9FwPQpfjH2udiX4pAnwEe/VdtjLb5zpucHEx9Ut8w27JWCEG/SnY5wF\nlK2de9xwx8cr3LvgxejpxntP75GSLdebnifBux4wzISawE5GAfau3jadYVLAUaX3\n9QRoIU1gZ2aHycX6ua6Z7yTVcVaM4X6+BXv8ZBcCgYEAxpzD/sHR+9ozjbCITjto\nBYGdcpCRBBmIP7NtdjGyaDkf2V9yuu6GLdZ1TG8hkt57Cy0JZi7PhQ7ko0TcUUBg\n0kwD4jbEM5nVdGhVLdXA8yg6smKcc2h9B+W8l1JRCjfquhVL/9EsPeRgupbDCruP\nUOIP34CJGYGlY2OFL6KwzsU=\n-----END PRIVATE KEY-----\n',
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    console.log('Creating calendar event...');

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
        { email: 'shadownik.official@gmail.com' }, // Admin
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

    console.log('Calendar event created successfully');

    const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri;

    // Send confirmation email to admin
    const adminMail = await transporter.sendMail({
      from: '"Shadownik Booking" <shadownik.official@gmail.com>',
      to: 'shadownik.official@gmail.com',
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

    console.log('Admin email sent successfully:', adminMail.messageId);

    // Send confirmation email to client
    const clientMail = await transporter.sendMail({
      from: '"Shadownik Booking" <shadownik.official@gmail.com>',
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

    console.log('Client email sent successfully:', clientMail.messageId);

    return res.status(200).json({ 
      message: 'Consultation booked successfully',
      meetLink 
    });
  } catch (error) {
    console.error('Detailed booking error:', error);
    return res.status(500).json({ 
      message: 'Failed to book consultation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 