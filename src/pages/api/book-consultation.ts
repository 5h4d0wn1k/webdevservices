import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../utils/emailService';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, date, time, projectType, budget, message, timeZone, durationMinutes } = req.body;

  try {
    console.log('Setting up email and calendar...');

    // Normalize Google private key (supports base64 or \n strings)
    const getPrivateKey = () => {
      const b64 = process.env.GOOGLE_PRIVATE_KEY_BASE64;
      if (b64 && b64.trim()) {
        try {
          const decoded = Buffer.from(b64, 'base64').toString('utf8');
          if (decoded.includes('BEGIN PRIVATE KEY')) return decoded;
        } catch {}
      }
      const key = process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_CALENDAR_KEY;
      if (!key) return undefined;
      const normalized = key.replace(/\\n/g, '\n');
      if (normalized.includes('BEGIN PRIVATE KEY')) return normalized;
      try {
        const decoded = Buffer.from(normalized, 'base64').toString('utf8');
        return decoded.includes('BEGIN PRIVATE KEY') ? decoded : normalized;
      } catch {
        return normalized;
      }
    };

    const privateKey = getPrivateKey();
    if (!privateKey) {
      return res.status(500).json({ message: 'Google Calendar not configured: missing private key' });
    }

    // Create JWT client for Google Calendar using the service account
    const auth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/calendar'],
      subject: process.env.GOOGLE_CALENDAR_SUBJECT || 'Shadownik(Swnk).official@gmail.com'
    });

    const calendar = google.calendar({ version: 'v3', auth });

    console.log('Creating calendar event...');

    // Parse date and time for event
    const eventStartTime = new Date(date);
    const [hoursStr, minutesStr] = time.split(':');
    let [hours, minutes] = [parseInt(hoursStr), 0];
    
    // Handle time format like "10:00 AM"
    if (time.includes('AM') || time.includes('PM')) {
      const timeParts = time.replace(/\s/g, '').match(/(\d+):(\d+)([AP]M)/i);
      if (timeParts) {
        hours = parseInt(timeParts[1]);
        minutes = parseInt(timeParts[2]);
        
        // Convert PM to 24-hour format
        if (timeParts[3].toUpperCase() === 'PM' && hours < 12) {
          hours += 12;
        }
        // Convert 12 AM to 0
        if (timeParts[3].toUpperCase() === 'AM' && hours === 12) {
          hours = 0;
        }
      }
    }
    
    eventStartTime.setHours(hours, minutes, 0);
    
    const meetingDuration = Number(durationMinutes) && Number(durationMinutes) > 0 ? Number(durationMinutes) : 30;
    const eventEndTime = new Date(eventStartTime);
    eventEndTime.setMinutes(eventEndTime.getMinutes() + meetingDuration);

    // Determine timezone (fallback to IST)
    const tz = typeof timeZone === 'string' && timeZone.trim() ? timeZone : 'Asia/Kolkata';

    // Check availability using FreeBusy for primary calendar
    try {
      const freeBusy = await calendar.freebusy.query({
        requestBody: {
          timeMin: eventStartTime.toISOString(),
          timeMax: eventEndTime.toISOString(),
          items: [{ id: 'primary' }],
          timeZone: tz
        }
      });

      const busy = freeBusy.data.calendars?.primary?.busy || [];
      if (busy.length > 0) {
        // Generate up to 5 alternative slots on the same day within business hours
        const suggestions: Array<{ start: string; end: string; display: string }> = [];
        const businessStartHour = 10; // 10:00
        const businessEndHour = 18; // 18:00

        // Start from requested time, then step forward in increments
        const iter = new Date(eventStartTime);
        const dayStart = new Date(eventStartTime);
        dayStart.setHours(businessStartHour, 0, 0, 0);
        const dayEnd = new Date(eventStartTime);
        dayEnd.setHours(businessEndHour, 0, 0, 0);

        // Ensure iterator is not before business start
        if (iter < dayStart) {
          iter.setTime(dayStart.getTime());
        }

        // Helper to check overlap
        const overlaps = (start: Date, end: Date) => {
          return busy.some(b => {
            const bStart = new Date(String(b.start));
            const bEnd = new Date(String(b.end));
            return start < bEnd && end > bStart;
          });
        };

        while (suggestions.length < 5 && iter < dayEnd) {
          const candidateStart = new Date(iter);
          const candidateEnd = new Date(iter);
          candidateEnd.setMinutes(candidateEnd.getMinutes() + meetingDuration);

          if (candidateEnd <= dayEnd && !overlaps(candidateStart, candidateEnd)) {
            const display = candidateStart.toLocaleString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true });
            suggestions.push({ start: candidateStart.toISOString(), end: candidateEnd.toISOString(), display });
          }
          // step 15 minutes
          iter.setMinutes(iter.getMinutes() + 15);
        }

        return res.status(409).json({
          message: 'Requested time is unavailable',
          available: false,
          suggestions,
        });
      }
    } catch (availabilityError) {
      console.error('Availability check failed:', availabilityError);
      // Continue but include warning; better to signal client
    }

    // Attendees for the meeting
    const attendees = [
      { email: "Shadownik(Swnk).official@gmail.com" }, // Host
      { email: "nikhilnagpure203@gmail.com", displayName: "Nikhil Nagpure (Founder & CEO)" },
      { email: "aniwiss07@gmail.com", displayName: "Web Development Lead" },
      { email: email, displayName: name } // Client
    ];

    // Create an event with Google Meet integration
    const event = {
      summary: `Shadownik(Swnk) Consultation with ${name}`,
      description: `
Client Consultation Details:
---------------------------
Name: ${name}
Email: ${email}
Phone: ${phone}
Project Type: ${projectType}
Budget: ${budget}

Project Details:
${message}
`,
      start: {
        dateTime: eventStartTime.toISOString(),
        timeZone: tz,
      },
      end: {
        dateTime: eventEndTime.toISOString(),
        timeZone: tz,
      },
      attendees: attendees,
      conferenceData: {
        createRequest: {
          requestId: `Shadownik(Swnk)-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      },
      // Add these settings to ensure invites are sent
      sendUpdates: 'all',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 * 24 }, // 1 day before
          { method: 'popup', minutes: 30 } // 30 minutes before
        ]
      }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
      sendNotifications: true // Ensure Google Calendar sends notifications
    });

    console.log('Calendar event created successfully:', response.data.id);

    const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri || '';
    const eventHtmlLink = response.data.htmlLink;

    // Format date and time for email
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
    
    // Use environment variable for logo URL with a fallback
    const logoUrl = process.env.LOGO_URL || 'https://swnk.in/logo.svg';
    
    // Common HTML styles for emails
    const emailStyles = `
      body { font-family: 'Arial', sans-serif; color: #333; line-height: 1.6; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(90deg, #4F46E5, #7C3AED); padding: 30px 20px; border-radius: 10px 10px 0 0; text-align: center; }
      .header h1 { color: white; margin: 0; font-size: 24px; }
      .content { background-color: #fff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eaeaea; border-top: none; }
      .meeting-box { background-color: #f9f9f9; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px; margin: 20px 0; }
      .meeting-details { margin-bottom: 20px; }
      .join-button { display: inline-block; background: linear-gradient(90deg, #4F46E5, #7C3AED); color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 10px; }
      table { width: 100%; border-collapse: collapse; }
      table td { padding: 8px; border-bottom: 1px solid #eaeaea; }
      table td:first-child { font-weight: bold; width: 150px; }
      .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
    `;

    // Template for admin email
    const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="Shadownik(Swnk) Logo" style="height: 40px; margin-bottom: 15px;">
          <h1>New Client Consultation Booking</h1>
        </div>
        <div class="content">
          <p>A new client has booked a consultation with Shadownik(Swnk).</p>
          
          <h2>Client Information</h2>
          <table>
            <tr>
              <td>Name:</td>
              <td>${name}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>${email}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>${phone}</td>
            </tr>
          </table>
          
          <h2>Project Information</h2>
          <table>
            <tr>
              <td>Project Type:</td>
              <td>${projectType}</td>
            </tr>
            <tr>
              <td>Budget:</td>
              <td>${budget}</td>
            </tr>
          </table>
          
          <h2>Project Details</h2>
          <p>${message || 'No additional details provided'}</p>
          
          <div class="meeting-box">
            <h2>Meeting Information</h2>
            <div class="meeting-details">
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Duration:</strong> ${meetingDuration} minutes</p>
            </div>
            <p>This meeting has been added to your Google Calendar.</p>
            <a href="${meetLink}" class="join-button">Join Google Meet</a>
            <p><small>Or copy this link: ${meetLink}</small></p>
          </div>
        </div>
        <div class="footer">
          <img src="${logoUrl}" alt="Shadownik(Swnk) Logo" style="height: 30px; margin-bottom: 15px;">
          <p>© ${new Date().getFullYear()} Shadownik(Swnk) Web Development Services</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Template for team member email (CEO and Web Dev Lead)
    const teamMemberHtml = (memberName: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="Shadownik(Swnk) Logo" style="height: 40px; margin-bottom: 15px;">
          <h1>Upcoming Client Consultation</h1>
        </div>
        <div class="content">
          <p>Dear ${memberName},</p>
          
          <p>You have an upcoming consultation scheduled with a potential client. Please review the details below and be prepared for the discussion.</p>
          
          <h2>Client Information</h2>
          <table>
            <tr>
              <td>Name:</td>
              <td>${name}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>${email}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>${phone}</td>
            </tr>
          </table>
          
          <h2>Project Information</h2>
          <table>
            <tr>
              <td>Project Type:</td>
              <td>${projectType}</td>
            </tr>
            <tr>
              <td>Budget:</td>
              <td>${budget}</td>
            </tr>
          </table>
          
          ${message ? `
          <h2>Client Message</h2>
          <p>${message}</p>
          ` : ''}
          
          <div class="meeting-box">
            <h2>Meeting Information</h2>
            <div class="meeting-details">
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Duration:</strong> ${meetingDuration} minutes</p>
            </div>
            <a href="${meetLink}" class="join-button">Join Google Meet</a>
            <p><small>Or copy this link: ${meetLink}</small></p>
          </div>
          
          <p>Please make sure to prepare for this consultation by:</p>
          <ul>
            <li>Reviewing any related projects in our portfolio</li>
            <li>Preparing a rough estimate based on the client's project type and budget</li>
            <li>Checking your equipment before the meeting (camera, microphone, etc.)</li>
          </ul>
          
          <p>Best regards,<br>Shadownik(Swnk) Team</p>
        </div>
        <div class="footer">
          <img src="${logoUrl}" alt="Shadownik(Swnk) Logo" style="height: 30px; margin-bottom: 15px;">
          <p>© ${new Date().getFullYear()} Shadownik(Swnk) Web Development Services</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Template for client email
    const clientHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="Shadownik(Swnk) Logo" style="height: 40px; margin-bottom: 15px;">
          <h1>Your Consultation with Shadownik(Swnk)</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>

          <p>Thank you for reaching out to Shadownik(Swnk) regarding your ${projectType} needs. We’ve received your details and our team will review them shortly.</p>

          <div class="meeting-box">
            <h2>What Happens Next</h2>
            <ul>
              <li>Our team reviews your information</li>
              <li>We check availability and propose suitable time slots if needed</li>
              <li>We’ll reach back to you professionally with the next steps</li>
            </ul>
          </div>

          <p>For any questions or further communication, please write to <a href="mailto:info@swnk.in">info@swnk.in</a>.</p>

          <p>We appreciate your interest and will be in touch soon.</p>

          <p>Best regards,<br>Team Shadownik(Swnk)</p>
        </div>
        <div class="footer">
          <img src="${logoUrl}" alt="Shadownik(Swnk) Logo" style="height: 30px; margin-bottom: 15px;">
          <p>© ${new Date().getFullYear()} Shadownik(Swnk) Web Development Services</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send meeting emails: to admins (Nikhil + company) and to client
    const adminRecipients = [
      'nikhilnagpure203@gmail.com',
      'info@swnk.in'
    ];

    const [adminEmailResult, clientEmailResult] = await Promise.all([
      sendEmail({
        to: adminRecipients,
        subject: `New Consultation: ${name} - ${formattedDate}`,
        html: adminHtml
      }),
      sendEmail({
        to: email,
        cc: adminRecipients,
        subject: 'Your Consultation with Shadownik(Swnk) - Confirmation',
        html: clientHtml
      })
    ]);
    
    console.log('Admin email sent:', adminEmailResult);
    
    console.log('Client email sent:', clientEmailResult);

    return res.status(200).json({ 
      message: 'Consultation booked successfully',
      meetLink,
      success: true
    });
  } catch (error) {
    console.error('Consultation booking error:', error);
    return res.status(500).json({
      message: 'Failed to book consultation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 