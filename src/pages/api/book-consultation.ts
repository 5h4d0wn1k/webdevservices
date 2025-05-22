import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../utils/emailService';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, date, time, projectType, budget, message } = req.body;

  try {
    console.log('Setting up email and calendar...');

    // Create JWT client for Google Calendar using the service account
    const auth = new JWT({
      email: "Shadownik(Swnk)-calender@web-dev-services-454105.iam.gserviceaccount.com",
      key: process.env.GOOGLE_CALENDAR_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
      subject: "Shadownik(Swnk).official@gmail.com" // Impersonate this user to make them the host
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
    
    const eventEndTime = new Date(eventStartTime);
    eventEndTime.setMinutes(eventEndTime.getMinutes() + 30);

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
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: eventEndTime.toISOString(),
        timeZone: 'Asia/Kolkata',
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
    const logoUrl = process.env.LOGO_URL || 'https://shadownik.online/logo.svg';
    
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
              <p><strong>Duration:</strong> 30 minutes</p>
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
              <p><strong>Duration:</strong> 30 minutes</p>
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
          
          <p>Thank you for booking a consultation with Shadownik(Swnk). We're looking forward to discussing your ${projectType} project with you.</p>
          
          <div class="meeting-box">
            <h2>Meeting Details</h2>
            <div class="meeting-details">
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Duration:</strong> 30 minutes</p>
              <p><strong>Platform:</strong> Google Meet (video conference)</p>
            </div>
            <p>You'll be meeting with our team including our Founder & CEO and Web Development Lead.</p>
            <a href="${meetLink}" class="join-button">Join Google Meet</a>
            <p><small>Or copy this link: ${meetLink}</small></p>
            <p><small>This meeting has also been added to your Google Calendar.</small></p>
          </div>
          
          <h2>Preparing for your consultation</h2>
          <p>To make the most of our time together, please:</p>
          <ul>
            <li>Prepare any specific questions you have about your project</li>
            <li>Consider having examples of websites or designs you like</li>
            <li>Think about your project goals, timeline, and specific requirements</li>
          </ul>
          
          <p>If you need to reschedule or have any questions before our meeting, please contact us at <a href="mailto:info@shadownik.online">info@shadownik.online</a>.</p>
          
          <p>We're looking forward to speaking with you!</p>
          
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

    // Send email to admin
    const adminEmailResult = await sendEmail({
      to: "Shadownik(Swnk).official@gmail.com",
      subject: `New Consultation: ${name} - ${formattedDate}`,
      html: adminHtml
    });
    
    console.log('Admin email sent:', adminEmailResult);

    // Send email to CEO
    const ceoEmailResult = await sendEmail({
      to: "nikhilnagpure203@gmail.com",
      subject: `Upcoming Consultation: ${name} - ${formattedDate}`,
      html: teamMemberHtml("Nikhil")
    });
    
    console.log('CEO email sent:', ceoEmailResult);

    // Send email to Web Development Lead
    const devLeadEmailResult = await sendEmail({
      to: "aniwiss07@gmail.com",
      subject: `Upcoming Consultation: ${name} - ${formattedDate}`,
      html: teamMemberHtml("Web Development Lead")
    });
    
    console.log('Web Dev Lead email sent:', devLeadEmailResult);

    // Send email to client
    const clientEmailResult = await sendEmail({
      to: email,
      subject: 'Your Consultation with Shadownik(Swnk) - Confirmation',
      html: clientHtml
    });
    
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