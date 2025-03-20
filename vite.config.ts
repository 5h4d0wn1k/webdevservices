import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import { Resend } from 'resend';

// Load environment variables
dotenv.config();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Google Calendar API setup
interface BookingData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  projectType: string;
  budget: string;
  message: string;
  requirements?: {
    features: string[];
    design: string;
    timeline: string;
  };
  technical?: {
    technologies: string[];
    hosting: string;
    domain: string;
  };
  businessInfo?: {
    name: string;
    industry: string;
    size: string;
    website: string;
  };
}

const createCalendarEvent = async (bookingData: BookingData) => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: process.env.GOOGLE_CREDENTIALS_TYPE || "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth" as any,
        token_uri: process.env.GOOGLE_TOKEN_URI || "https://oauth2.googleapis.com/token" as any,
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs" as any,
        client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL as any,
        universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN || "googleapis.com" as any
      } as any,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });
    
    // Parse date and time
    const bookingDate = new Date(bookingData.date);
    
    // Parse time string (e.g., "11:00 AM")
    const timeMatch = bookingData.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) {
      throw new Error('Invalid time format');
    }
    
    const [_, hours, minutes, period] = timeMatch;
    let hour = parseInt(hours);
    const minute = parseInt(minutes);
    
    // Convert to 24-hour format
    if (period.toUpperCase() === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period.toUpperCase() === 'AM' && hour === 12) {
      hour = 0;
    }
    
    // Create start time
    const startTime = new Date(bookingDate);
    startTime.setHours(hour, minute, 0, 0);
    
    // Create end time (30 minutes later)
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 30);
    
    // Create detailed description based on form type
    let description = `
Client Information:
------------------
Name: ${bookingData.name}
Email: ${bookingData.email}
Phone: ${bookingData.phone}
Project Type: ${bookingData.projectType}
Budget: ${bookingData.budget}

Project Details:
${bookingData.message}

Meeting Link: ${process.env.GOOGLE_MEET_LINK || 'https://meet.google.com/heg-ohgs-qfv'}
`;

    // Add additional details if from client onboarding
    if (bookingData.businessInfo) {
      description += `
Business Information:
-------------------
Business Name: ${bookingData.businessInfo.name}
Industry: ${bookingData.businessInfo.industry}
Company Size: ${bookingData.businessInfo.size}
Current Website: ${bookingData.businessInfo.website || 'None'}

Required Features:
${bookingData.requirements?.features.join('\n') || 'None specified'}

Design Preferences:
${bookingData.requirements?.design || 'None specified'}

Timeline:
${bookingData.requirements?.timeline || 'Not specified'}

Technical Requirements:
---------------------
Technologies: ${bookingData.technical?.technologies.join(', ') || 'Not specified'}
Hosting Preference: ${bookingData.technical?.hosting || 'Not specified'}
Domain Status: ${bookingData.technical?.domain || 'Not specified'}
`;
    }
    
    // Create meeting without conferenceData
    const event = {
      summary: `Shadownik Consultation with ${bookingData.name}`,
      description,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 * 24 }, // 1 day before
          { method: 'popup', minutes: 30 } // 30 minutes before
        ]
      }
    };
    
    const result = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      sendUpdates: 'none'
    });
    
    console.log('Calendar event created:', result.data);
    
    // Use the environment variable for meet link with fallback
    const meetLink = process.env.GOOGLE_MEET_LINK || "https://meet.google.com/heg-ohgs-qfv";
    
    // Send emails with the meet link
    const adminEmails = [
      'shadownik.official@gmail.com', // Always include main admin email
      process.env.INFO_EMAIL || 'info@shadownik.online', // Always include info email
      process.env.ADMIN_EMAIL,
      process.env.FOUNDER_EMAIL,
      process.env.LEAD_EMAIL
    ].filter(Boolean); // Remove any undefined/empty entries
    
    console.log('Sending consultation notification to:', adminEmails);
    
    // Send admin emails
    await Promise.all(adminEmails.map(email => 
      resend.emails.send({
        from: `Shadownik Booking <bookings@${String(process.env.EMAIL_DOMAIN || 'web.shadownik.online')}>`,
        to: String(email),
        subject: `New Consultation Booking with ${bookingData.name}`,
        html: generateConsultationEmail(bookingData, meetLink, true)
      })
    ));
    
    // Send client email
    await resend.emails.send({
      from: `Shadownik Booking <bookings@${String(process.env.EMAIL_DOMAIN || 'web.shadownik.online')}>`,
      to: String(bookingData.email),
      subject: 'Your Shadownik Consultation is Scheduled',
      html: generateConsultationEmail(bookingData, meetLink, false)
    });
    
    return {
      meetLink,
      eventId: result.data.id
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

// Email template for consultation confirmation
const generateConsultationEmail = (bookingData: BookingData, meetLink: string | null | undefined, isAdmin: boolean = false) => {
  // Ensure meetLink is always a string
  const safeLink = meetLink || process.env.GOOGLE_MEET_LINK || 'https://meet.google.com';
  
  const date = new Date(bookingData.date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Social media links HTML - used in all email templates
  const socialMediaLinks = `
    <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 24px;">
      <a href="https://github.com/Shadownik-official" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
      </a>
      <a href="https://x.com/Shadownik_ofc" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/123/123728.png" alt="Twitter" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
      </a>
      <a href="https://www.linkedin.com/company/shadownik" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
      </a>
      <a href="https://www.facebook.com/people/Shadownik/61562599613319" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
      </a>
      <a href="https://instagram.com/Shadownik.official" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
        <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
      </a>
    </div>
  `;

  // Build detailed description for the admin email
  const buildDetailedProjectInfo = () => {
    let detailedInfo = '';
    
    if (bookingData.requirements) {
      detailedInfo += `
      <!-- Project Requirements -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; font-weight: 600; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 12px;">Project Requirements</h2>
        
        <h3 style="color: #4F46E5; margin: 20px 0 10px; font-size: 16px;">Features Needed:</h3>
        <ul style="margin: 0; padding: 0 0 0 20px;">
          ${bookingData.requirements?.features?.map(feature => `<li style="padding: 4px 0; font-size: 15px;">${feature}</li>`).join('') || '<li style="padding: 4px 0; font-size: 15px;">None specified</li>'}
        </ul>
        
        <h3 style="color: #4F46E5; margin: 20px 0 10px; font-size: 16px;">Design Preferences:</h3>
        <p style="margin: 0; font-size: 15px;">${bookingData.requirements?.design || 'None specified'}</p>
        
        <h3 style="color: #4F46E5; margin: 20px 0 10px; font-size: 16px;">Timeline:</h3>
        <p style="margin: 0; font-size: 15px;">${bookingData.requirements?.timeline || 'Not specified'}</p>
      </div>
      `;
    }
    
    if (bookingData.technical) {
      detailedInfo += `
      <!-- Technical Requirements -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; font-weight: 600; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 12px;">Technical Requirements</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; width: 170px; color: #666; font-size: 15px;">Technologies:</td>
            <td style="padding: 8px 0; font-size: 15px;">${bookingData.technical?.technologies?.join(', ') || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 15px;">Hosting Preference:</td>
            <td style="padding: 8px 0; font-size: 15px;">${bookingData.technical?.hosting || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 15px;">Domain Status:</td>
            <td style="padding: 8px 0; font-size: 15px;">${bookingData.technical?.domain || 'Not specified'}</td>
          </tr>
        </table>
      </div>
      `;
    }
    
    return detailedInfo;
  };

  if (isAdmin) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Consultation Booking</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f5f5f7;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
          <!-- Header with gradient -->
          <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 35px 20px; text-align: center;">
            <img src="/src/assets/logo/shadownik-logo.svg" alt="Shadownik Logo" style="height: 40px; margin-bottom: 20px;">
            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">New Consultation Booking</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 16px;">A new client has scheduled a consultation with you</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <!-- Booking Details Card -->
            <div style="background-color: #f9f9fb; border-radius: 12px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #4F46E5;">
              <h2 style="margin-top: 0; color: #4F46E5; font-size: 20px; font-weight: 600;">Consultation Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; width: 130px; color: #666; font-size: 15px;">Date:</td>
                  <td style="padding: 8px 0; font-weight: 500; font-size: 15px;">${date}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 15px;">Time:</td>
                  <td style="padding: 8px 0; font-weight: 500; font-size: 15px;">${bookingData.time}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 15px;">Duration:</td>
                  <td style="padding: 8px 0; font-weight: 500; font-size: 15px;">30 minutes</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 15px;">Meeting:</td>
                  <td style="padding: 8px 0;">
                    <a href="${safeLink}" style="display: inline-block; padding: 8px 16px; background-color: #4F46E5; color: white; text-decoration: none; font-weight: 500; border-radius: 6px; font-size: 14px;">Join Meeting</a>
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Client Information -->
            <div style="margin-bottom: 30px;">
              <h2 style="color: #333; font-size: 20px; font-weight: 600; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 12px;">Client Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; width: 130px; color: #666; font-size: 15px;">Name:</td>
                  <td style="padding: 8px 0; font-weight: 500; font-size: 15px;">${bookingData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 15px;">Email:</td>
                  <td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${bookingData.email}" style="color: #4F46E5; text-decoration: none;">${bookingData.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 15px;">Phone:</td>
                  <td style="padding: 8px 0; font-size: 15px;"><a href="tel:${bookingData.phone}" style="color: #4F46E5; text-decoration: none;">${bookingData.phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 15px;">Project Type:</td>
                  <td style="padding: 8px 0; font-size: 15px;">${bookingData.projectType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 15px;">Budget:</td>
                  <td style="padding: 8px 0; font-size: 15px;">${bookingData.budget}</td>
                </tr>
              </table>
            </div>
            
            <!-- Project Details -->
            <div style="margin-bottom: 30px;">
              <h2 style="color: #333; font-size: 20px; font-weight: 600; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 12px;">Project Details</h2>
              <div style="background-color: #f9f9fb; border-radius: 8px; padding: 15px; font-size: 15px; line-height: 1.5;">
                ${bookingData.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            ${bookingData.businessInfo ? `
            <!-- Business Information -->
            <div style="margin-bottom: 30px;">
              <h2 style="color: #333; font-size: 20px; font-weight: 600; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 12px;">Business Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; width: 150px; color: #666; font-size: 15px;">Business Name:</td>
                  <td style="padding: 8px 0; font-weight: 500; font-size: 15px;">${bookingData.businessInfo.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 15px;">Industry:</td>
                  <td style="padding: 8px 0; font-size: 15px;">${bookingData.businessInfo.industry}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 15px;">Company Size:</td>
                  <td style="padding: 8px 0; font-size: 15px;">${bookingData.businessInfo.size}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 15px;">Website:</td>
                  <td style="padding: 8px 0; font-size: 15px;">
                    ${bookingData.businessInfo.website ? 
                      `<a href="${bookingData.businessInfo.website}" style="color: #4F46E5; text-decoration: none;">${bookingData.businessInfo.website}</a>` : 
                      'None'}
                  </td>
                </tr>
              </table>
            </div>
            
            ${buildDetailedProjectInfo()}
            ` : ''}
            
            <!-- Next Steps -->
            <div style="background: linear-gradient(to right, #EEF2FF, #F3F4F6); border-radius: 12px; padding: 25px; margin-top: 15px;">
              <h2 style="color: #4F46E5; margin-top: 0; font-size: 18px; font-weight: 600;">Next Steps:</h2>
              <ol style="margin: 15px 0 0; padding: 0 0 0 20px;">
                <li style="padding: 6px 0; font-size: 15px;">Review the client's requirements before the meeting</li>
                <li style="padding: 6px 0; font-size: 15px;">Prepare relevant questions based on the project details</li>
                <li style="padding: 6px 0; font-size: 15px;">Join the meeting 5 minutes before the scheduled time</li>
                <li style="padding: 6px 0; font-size: 15px;">Consider potential solutions and pricing options to discuss</li>
              </ol>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="padding: 30px; background-color: #f6f6f9; text-align: center; border-top: 1px solid #eee;">
            <img src="/src/assets/logo/shadownik-logo.svg" alt="Shadownik" style="height: 28px; margin-bottom: 20px;">
            <p style="margin: 0 0 15px; color: #666; font-size: 14px;">
              Crafting exceptional digital experiences through innovative design and cutting-edge technology.
            </p>
            
            ${socialMediaLinks}
            
            <p style="margin: 20px 0 0; color: #999; font-size: 13px;">
              © 2024 Shadownik. All rights reserved.
            </p>
            <p style="margin: 5px 0 0; color: #999; font-size: 12px;">
              This is an automated message from Shadownik Web Development Services
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  } else {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Consultation Scheduled Successfully</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f5f5f7;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
          <!-- Header with gradient -->
          <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 35px 20px; text-align: center;">
            <img src="/src/assets/logo/shadownik-logo.svg" alt="Shadownik Logo" style="height: 40px; margin-bottom: 20px;">
            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Your Consultation is Confirmed!</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 16px;">Thank you for scheduling a consultation with Shadownik</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="margin-top: 0; font-size: 16px; line-height: 1.6;">
              Dear <span style="font-weight: 600;">${bookingData.name}</span>,
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Thank you for scheduling a consultation with Shadownik. We're excited to connect with you and discuss your project requirements.
            </p>
            
            <!-- Consultation Details Card -->
            <div style="background-color: #f9f9fb; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #4F46E5;">
              <h2 style="margin-top: 0; color: #4F46E5; font-size: 20px; font-weight: 600;">Consultation Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; width: 130px; color: #666; font-size: 15px;">Date:</td>
                  <td style="padding: 8px 0; font-weight: 500; font-size: 15px;">${date}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 15px;">Time:</td>
                  <td style="padding: 8px 0; font-weight: 500; font-size: 15px;">${bookingData.time}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 15px;">Duration:</td>
                  <td style="padding: 8px 0; font-weight: 500; font-size: 15px;">30 minutes</td>
                </tr>
              </table>
              
              <div style="margin-top: 20px; text-align: center;">
                <a href="${safeLink}" style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; font-weight: 500; border-radius: 6px; font-size: 16px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">Join Meeting</a>
                <p style="margin: 15px 0 0; font-size: 14px; color: #666;">
                  Simply click the button above at the time of your consultation.
                </p>
              </div>
            </div>
            
            <!-- What to Prepare -->
            <div style="background: linear-gradient(to right, #EEF2FF, #F3F4F6); border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h2 style="color: #4F46E5; margin-top: 0; font-size: 18px; font-weight: 600;">How to Prepare:</h2>
              <ul style="margin: 15px 0 0; padding: 0 0 0 20px;">
                <li style="padding: 6px 0; font-size: 15px;">Review your project requirements and goals</li>
                <li style="padding: 6px 0; font-size: 15px;">Have any reference websites or designs ready to share</li>
                <li style="padding: 6px 0; font-size: 15px;">Prepare specific questions about your project</li>
                <li style="padding: 6px 0; font-size: 15px;">Test your camera and microphone before the call</li>
                <li style="padding: 6px 0; font-size: 15px;">Find a quiet location with stable internet connection</li>
              </ul>
            </div>
            
            <!-- Important Notes Card -->
            <div style="background-color: #FEF3C7; border-radius: 12px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #D97706;">
              <h2 style="margin-top: 0; color: #92400E; font-size: 18px; font-weight: 600;">Important Notes:</h2>
              <ul style="margin: 15px 0 0; padding: 0 0 0 20px;">
                <li style="padding: 6px 0; font-size: 15px;">Please join the meeting 5 minutes before the scheduled time</li>
                <li style="padding: 6px 0; font-size: 15px;">If you need to reschedule, please contact us at least 24 hours in advance at <a href="mailto:contact@shadownik.online" style="color: #4F46E5; text-decoration: none;">contact@shadownik.online</a></li>
                <li style="padding: 6px 0; font-size: 15px;">The consultation is scheduled for 30 minutes, but we can extend if needed</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              We look forward to connecting with you and discussing how we can help bring your vision to life. If you have any questions before our consultation, please don't hesitate to reach out.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
              Best regards,
            </p>
            <p style="font-size: 16px; line-height: 1.6; margin-top: 0; font-weight: 600;">
              The Shadownik Team
            </p>
          </div>
          
          <!-- Footer -->
          <div style="padding: 30px; background-color: #f6f6f9; text-align: center; border-top: 1px solid #eee;">
            <img src="/src/assets/logo/shadownik-logo.svg" alt="Shadownik" style="height: 28px; margin-bottom: 20px;">
            <p style="margin: 0 0 15px; color: #666; font-size: 14px;">
              Crafting exceptional digital experiences through innovative design and cutting-edge technology.
            </p>
            
            ${socialMediaLinks}
            
            <p style="margin: 20px 0 0; color: #999; font-size: 13px;">
              © 2024 Shadownik. All rights reserved.
            </p>
            <p style="margin: 5px 0 0; color: #999; font-size: 12px;">
              This is an automated message from Shadownik Web Development Services
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Mock API for development
    {
      name: 'mock-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          console.log(`Request received: ${req.method} ${req.url}`);
          
          // Handle consultation bookings
          if (req.url === '/api/book-consultation' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            
            req.on('end', async () => {
              try {
                const bookingData = JSON.parse(body);
                console.log('Consultation booking:', bookingData);
                
                // Create calendar event and get meet link
                const { meetLink, eventId } = await createCalendarEvent(bookingData);
                
                // Return success response with meet link
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                  message: 'Consultation booked successfully',
                  meetLink,
                  eventId
                }));
              } catch (error) {
                console.error('Error processing booking:', error);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                  message: 'Failed to book consultation',
                  error: error instanceof Error ? error.message : 'Unknown error'
                }));
              }
            });
            
            return;
          }
          
          // Handle client onboarding submissions
          if (req.url === '/api/submit-project' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            
            req.on('end', async () => {
              try {
                const formData = JSON.parse(body);
                console.log('Project submission:', formData);
                
                // Create calendar event and get meet link
                const { meetLink, eventId } = await createCalendarEvent(formData);
                
                // Return success response with meet link
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                  message: 'Project submitted successfully',
                  meetLink,
                  eventId
              }));
            } catch (error) {
                console.error('Error processing project submission:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                  message: 'Failed to submit project',
                error: error instanceof Error ? error.message : 'Unknown error'
              }));
            }
            });
            
            return;
          }
          
          // Handle contact form submissions
          if (req.url === '/api/contact' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            
            req.on('end', async () => {
              try {
                const formData = JSON.parse(body);
                console.log('Contact form submission:', formData);
                
                // Send email to admin
                await resend.emails.send({
                  from: `Shadownik Contact <contact@${String(process.env.EMAIL_DOMAIN || 'shadownik.com')}>`,
                  to: [String(process.env.EMAIL_TO || 'shadownik.official@gmail.com'), 'shadownik.official@gmail.com'].filter((v, i, a) => a.indexOf(v) === i).join(','),
                  subject: `New Contact Form Submission from ${formData.name}`,
                  html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>New Contact Form Submission</title>
                    </head>
                    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f5f5f7;">
                      <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
                        <!-- Header with gradient -->
                        <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 35px 20px; text-align: center;">
                          <img src="/src/assets/logo/shadownik-logo.svg" alt="Shadownik Logo" style="height: 40px; margin-bottom: 20px;">
                          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">New Contact Inquiry</h1>
                          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 16px;">A potential client has submitted a contact form</p>
                        </div>
                        
                        <!-- Content -->
                        <div style="padding: 40px 30px;">
                          <!-- Contact Information -->
                          <div style="margin-bottom: 30px;">
                            <h2 style="color: #333; font-size: 20px; font-weight: 600; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 12px;">Contact Information</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="padding: 8px 0; width: 130px; color: #666; font-size: 15px;">Name:</td>
                                <td style="padding: 8px 0; font-weight: 500; font-size: 15px;">${formData.name}</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #666; font-size: 15px;">Email:</td>
                                <td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${formData.email}" style="color: #4F46E5; text-decoration: none;">${formData.email}</a></td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #666; font-size: 15px;">Service:</td>
                                <td style="padding: 8px 0; font-size: 15px;">${formData.service}</td>
                              </tr>
                            </table>
                          </div>
                          
                          <!-- Message -->
                          <div style="margin-bottom: 30px;">
                            <h2 style="color: #333; font-size: 20px; font-weight: 600; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 12px;">Message</h2>
                            <div style="background-color: #f9f9fb; border-radius: 8px; padding: 15px; font-size: 15px; line-height: 1.5;">
                              ${formData.message.replace(/\n/g, '<br>')}
                            </div>
                          </div>
                          
                          <!-- Next Steps -->
                          <div style="background: linear-gradient(to right, #EEF2FF, #F3F4F6); border-radius: 12px; padding: 25px; margin-top: 15px;">
                            <h2 style="color: #4F46E5; margin-top: 0; font-size: 18px; font-weight: 600;">Recommended Next Steps:</h2>
                            <ol style="margin: 15px 0 0; padding: 0 0 0 20px;">
                              <li style="padding: 6px 0; font-size: 15px;">Review the inquiry details</li>
                              <li style="padding: 6px 0; font-size: 15px;">Respond within 24 hours</li>
                              <li style="padding: 6px 0; font-size: 15px;">Recommend a suitable service package</li>
                              <li style="padding: 6px 0; font-size: 15px;">Schedule a follow-up consultation if needed</li>
                            </ol>
                          </div>
                        </div>
                        
                        <!-- Footer -->
                        <div style="padding: 30px; background-color: #f6f6f9; text-align: center; border-top: 1px solid #eee;">
                          <img src="/src/assets/logo/shadownik-logo.svg" alt="Shadownik" style="height: 28px; margin-bottom: 20px;">
                          <p style="margin: 0 0 15px; color: #666; font-size: 14px;">
                            Crafting exceptional digital experiences through innovative design and cutting-edge technology.
                          </p>
                          
                          <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 24px;">
                            <a href="https://github.com/Shadownik-official" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://x.com/Shadownik_ofc" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/123/123728.png" alt="Twitter" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://www.linkedin.com/company/shadownik" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://www.facebook.com/people/Shadownik/61562599613319" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://instagram.com/Shadownik.official" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                          </div>
                          
                          <p style="margin: 20px 0 0; color: #999; font-size: 13px;">
                            © 2024 Shadownik. All rights reserved.
                          </p>
                          <p style="margin: 5px 0 0; color: #999; font-size: 12px;">
                            This is an automated message from Shadownik Web Development Services
                          </p>
                        </div>
                      </div>
                    </body>
                    </html>
                  `
                });
                
                // Send confirmation email to client
                await resend.emails.send({
                  from: `Shadownik Contact <contact@${String(process.env.EMAIL_DOMAIN || 'shadownik.com')}>`,
                  to: String(formData.email),
                  subject: 'Thank You for Contacting Shadownik',
                  html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Thank You for Contacting Us</title>
                    </head>
                    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f5f5f7;">
                      <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
                        <!-- Header with gradient -->
                        <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 35px 20px; text-align: center;">
                          <img src="/src/assets/logo/shadownik-logo.svg" alt="Shadownik Logo" style="height: 40px; margin-bottom: 20px;">
                          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Thank You for Reaching Out!</h1>
                          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 16px;">We've received your message and will be in touch soon</p>
                        </div>
                        
                        <!-- Content -->
                        <div style="padding: 40px 30px;">
                          <p style="margin-top: 0; font-size: 16px; line-height: 1.6;">
                            Dear <span style="font-weight: 600;">${formData.name}</span>,
                          </p>
                          
                          <p style="font-size: 16px; line-height: 1.6;">
                            Thank you for reaching out to Shadownik. We've received your inquiry about our ${formData.service} services and are excited to help you with your project.
                          </p>
                          
                          <p style="font-size: 16px; line-height: 1.6;">
                            Our team is reviewing your message and will get back to you within 24 hours with more information tailored to your specific needs.
                          </p>
                          
                          <!-- What's Next -->
                          <div style="background: linear-gradient(to right, #EEF2FF, #F3F4F6); border-radius: 12px; padding: 25px; margin: 30px 0;">
                            <h2 style="color: #4F46E5; margin-top: 0; font-size: 18px; font-weight: 600;">What Happens Next:</h2>
                            <ol style="margin: 15px 0 0; padding: 0 0 0 20px;">
                              <li style="padding: 6px 0; font-size: 15px;">A member of our team will contact you via email within 24 hours</li>
                              <li style="padding: 6px 0; font-size: 15px;">We'll provide information specific to your requirements and service interest</li>
                              <li style="padding: 6px 0; font-size: 15px;">We can schedule a consultation call to discuss your project in detail</li>
                              <li style="padding: 6px 0; font-size: 15px;">We'll develop a tailored proposal based on your needs</li>
                            </ol>
                          </div>
                          
                          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                            If you have any urgent questions in the meantime, please feel free to call us at <a href="tel:+919165644843" style="color: #4F46E5; text-decoration: none; font-weight: 500;">+91 9165644843</a> or reply directly to this email.
                          </p>
                          
                          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
                            Looking forward to collaborating with you,
                          </p>
                          <p style="font-size: 16px; line-height: 1.6; margin-top: 0; font-weight: 600;">
                            The Shadownik Team
                          </p>
                        </div>
                        
                        <!-- Footer -->
                        <div style="padding: 30px; background-color: #f6f6f9; text-align: center; border-top: 1px solid #eee;">
                          <img src="/src/assets/logo/shadownik-logo.svg" alt="Shadownik" style="height: 28px; margin-bottom: 20px;">
                          <p style="margin: 0 0 15px; color: #666; font-size: 14px;">
                            Crafting exceptional digital experiences through innovative design and cutting-edge technology.
                          </p>
                          
                          <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 24px;">
                            <a href="https://github.com/Shadownik-official" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://x.com/Shadownik_ofc" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/123/123728.png" alt="Twitter" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://www.linkedin.com/company/shadownik" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://www.facebook.com/people/Shadownik/61562599613319" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://instagram.com/Shadownik.official" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                          </div>
                          
                          <p style="margin: 20px 0 0; color: #999; font-size: 13px;">
                            © 2024 Shadownik. All rights reserved.
                          </p>
                          <p style="margin: 5px 0 0; color: #999; font-size: 12px;">
                            This is an automated message from Shadownik Web Development Services
                          </p>
                        </div>
                      </div>
                    </body>
                    </html>
                  `
                });
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Message sent successfully' }));
              } catch (error) {
                console.error('Error processing contact form:', error);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                  message: 'Failed to send message',
                  error: error instanceof Error ? error.message : 'Unknown error'
                }));
              }
            });
            
            return;
          }
          
          // Handle newsletter submissions
          if (req.url === '/api/newsletter' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            
            req.on('end', async () => {
              try {
                const { email } = JSON.parse(body);
                console.log('Newsletter subscription:', email);
                
                // Get admin recipients from environment variables
                const adminRecipients = [
                  process.env.ADMIN_EMAIL || 'shadownik.official@gmail.com',
                  process.env.INFO_EMAIL || 'info@shadownik.online'
                ].filter(Boolean); // Filter out any undefined values
                
                console.log('Sending newsletter notification to:', adminRecipients);
                
                // Send notification to admin
                await resend.emails.send({
                  from: `Shadownik Newsletter <newsletter@${String(process.env.EMAIL_DOMAIN || 'shadownik.com')}>`,
                  to: adminRecipients,
                  subject: 'New Newsletter Subscription',
                  html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>New Newsletter Subscription</title>
                    </head>
                    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f5f5f7;">
                      <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
                        <!-- Header with gradient -->
                        <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 35px 20px; text-align: center;">
                          <img src="/src/assets/logo/shadownik-logo.svg" alt="Shadownik Logo" style="height: 40px; margin-bottom: 20px;">
                          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">New Newsletter Subscription</h1>
                          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 16px;">A new subscriber has joined your mailing list</p>
                        </div>
                        
                        <!-- Content -->
                        <div style="padding: 40px 30px;">
                          <!-- Subscriber Information -->
                          <div style="margin-bottom: 30px;">
                            <h2 style="color: #333; font-size: 20px; font-weight: 600; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 12px;">Subscriber Details</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="padding: 8px 0; width: 130px; color: #666; font-size: 15px;">Email:</td>
                                <td style="padding: 8px 0; font-weight: 500; font-size: 15px;"><a href="mailto:${email}" style="color: #4F46E5; text-decoration: none;">${email}</a></td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #666; font-size: 15px;">Date:</td>
                                <td style="padding: 8px 0; font-size: 15px;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #666; font-size: 15px;">Source:</td>
                                <td style="padding: 8px 0; font-size: 15px;">Website Newsletter Form</td>
                              </tr>
                            </table>
                          </div>
                          
                          <!-- Next Steps -->
                          <div style="background: linear-gradient(to right, #EEF2FF, #F3F4F6); border-radius: 12px; padding: 25px; margin-top: 15px;">
                            <h2 style="color: #4F46E5; margin-top: 0; font-size: 18px; font-weight: 600;">Recommended Actions:</h2>
                            <ul style="margin: 15px 0 0; padding: 0 0 0 20px;">
                              <li style="padding: 6px 0; font-size: 15px;">Add this email to your newsletter distribution list</li>
                              <li style="padding: 6px 0; font-size: 15px;">Consider sending a personalized welcome message</li>
                              <li style="padding: 6px 0; font-size: 15px;">Include this subscriber in your next newsletter campaign</li>
                            </ul>
                          </div>
                        </div>
                        
                        <!-- Footer -->
                        <div style="padding: 30px; background-color: #f6f6f9; text-align: center; border-top: 1px solid #eee;">
                          <img src="/src/assets/logo/shadownik-logo.svg" alt="Shadownik" style="height: 28px; margin-bottom: 20px;">
                          <p style="margin: 0 0 15px; color: #666; font-size: 14px;">
                            Crafting exceptional digital experiences through innovative design and cutting-edge technology.
                          </p>
                          
                          <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 24px;">
                            <a href="https://github.com/Shadownik-official" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://x.com/Shadownik_ofc" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/123/123728.png" alt="Twitter" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://www.linkedin.com/company/shadownik" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://www.facebook.com/people/Shadownik/61562599613319" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://instagram.com/Shadownik.official" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                          </div>
                          
                          <p style="margin: 20px 0 0; color: #999; font-size: 13px;">
                            © 2024 Shadownik. All rights reserved.
                          </p>
                          <p style="margin: 5px 0 0; color: #999; font-size: 12px;">
                            To unsubscribe, please reply to this email with "UNSUBSCRIBE" in the subject line.
                          </p>
                        </div>
                      </div>
                    </body>
                    </html>
                  `
                });
                
                // Send confirmation email to subscriber
                await resend.emails.send({
                  from: `Shadownik Newsletter <newsletter@${String(process.env.EMAIL_DOMAIN || 'shadownik.com')}>`,
                  to: String(email),
                  subject: 'Welcome to Shadownik Newsletter!',
                  html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Welcome to Shadownik Newsletter</title>
                    </head>
                    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f5f5f7;">
                      <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
                        <!-- Header with gradient -->
                        <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 35px 20px; text-align: center;">
                          <img src="/src/assets/logo/shadownik-logo.svg" alt="Shadownik Logo" style="height: 40px; margin-bottom: 20px;">
                          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Welcome to Our Newsletter!</h1>
                          <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0; font-size: 16px;">Thank you for subscribing to Shadownik updates</p>
                        </div>
                        
                        <!-- Content -->
                        <div style="padding: 40px 30px;">
                          <p style="margin-top: 0; font-size: 16px; line-height: 1.6;">
                            Hello from the Shadownik team!
                          </p>
                          
                          <p style="font-size: 16px; line-height: 1.6;">
                            Thank you for subscribing to our newsletter. We're thrilled to have you join our community of forward-thinking businesses and tech enthusiasts.
                          </p>
                          
                          <!-- What You'll Receive -->
                          <div style="background-color: #f9f9fb; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #4F46E5;">
                            <h2 style="margin-top: 0; color: #4F46E5; font-size: 20px; font-weight: 600;">What You'll Receive:</h2>
                            <ul style="margin: 15px 0 0; padding: 0 0 0 20px;">
                              <li style="padding: 8px 0; font-size: 15px;"><strong>Insider Tips:</strong> Web development best practices and trends</li>
                              <li style="padding: 8px 0; font-size: 15px;"><strong>Exclusive Content:</strong> Articles and guides before anyone else</li>
                              <li style="padding: 8px 0; font-size: 15px;"><strong>Case Studies:</strong> Real-world success stories and implementations</li>
                              <li style="padding: 8px 0; font-size: 15px;"><strong>Special Offers:</strong> Promotions and discounts exclusive to subscribers</li>
                            </ul>
                          </div>
                          
                          <div style="text-align: center; margin: 40px 0;">
                            <a href="https://www.shadownik.online" style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; text-decoration: none; font-weight: 500; border-radius: 8px; font-size: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">Explore Our Services</a>
                          </div>
                          
                          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                            We send newsletters approximately twice a month and promise not to spam your inbox. If you ever wish to unsubscribe, you can do so by clicking the unsubscribe link at the bottom of any newsletter.
                          </p>
                          
                          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
                            Looking forward to sharing valuable insights with you,
                          </p>
                          <p style="font-size: 16px; line-height: 1.6; margin-top: 0; font-weight: 600;">
                            The Shadownik Team
                          </p>
                        </div>
                        
                        <!-- Featured Services -->
                        <div style="padding: 0 30px 40px;">
                          <h2 style="text-align: center; color: #333; font-size: 22px; font-weight: 600; margin-bottom: 25px;">Our Services</h2>
                          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                            <div style="background: linear-gradient(to bottom right, #f1f5f9, #e2e8f0); padding: 20px; border-radius: 10px; text-align: center;">
                              <h3 style="margin-top: 0; color: #4F46E5; font-size: 16px;">Web Development</h3>
                              <p style="margin-bottom: 0; font-size: 14px; color: #555;">Custom websites built for performance and growth</p>
                            </div>
                            <div style="background: linear-gradient(to bottom right, #f1f5f9, #e2e8f0); padding: 20px; border-radius: 10px; text-align: center;">
                              <h3 style="margin-top: 0; color: #4F46E5; font-size: 16px;">E-Commerce</h3>
                              <p style="margin-bottom: 0; font-size: 14px; color: #555;">Online stores that drive conversions</p>
                            </div>
                            <div style="background: linear-gradient(to bottom right, #f1f5f9, #e2e8f0); padding: 20px; border-radius: 10px; text-align: center;">
                              <h3 style="margin-top: 0; color: #4F46E5; font-size: 16px;">UI/UX Design</h3>
                              <p style="margin-bottom: 0; font-size: 14px; color: #555;">Beautiful interfaces with intuitive experiences</p>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Footer -->
                        <div style="padding: 30px; background-color: #f6f6f9; text-align: center; border-top: 1px solid #eee;">
                          <img src="/src/assets/logo/shadownik-logo.svg" alt="Shadownik" style="height: 28px; margin-bottom: 20px;">
                          <p style="margin: 0 0 15px; color: #666; font-size: 14px;">
                            Crafting exceptional digital experiences through innovative design and cutting-edge technology.
                          </p>
                          
                          <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 24px;">
                            <a href="https://github.com/Shadownik-official" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://x.com/Shadownik_ofc" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/123/123728.png" alt="Twitter" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://www.linkedin.com/company/shadownik" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://www.facebook.com/people/Shadownik/61562599613319" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                            <a href="https://instagram.com/Shadownik.official" target="_blank" style="display: inline-block; padding: 6px; background: rgba(79, 70, 229, 0.1); border-radius: 6px; color: #4F46E5; text-decoration: none;">
                              <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="20" height="20" style="filter: invert(38%) sepia(65%) saturate(6695%) hue-rotate(231deg) brightness(91%) contrast(101%);">
                            </a>
                          </div>
                          
                          <p style="margin: 20px 0 0; color: #999; font-size: 13px;">
                            © 2024 Shadownik. All rights reserved.
                          </p>
                          <p style="margin: 5px 0 0; color: #999; font-size: 12px;">
                            To unsubscribe, please reply to this email with "UNSUBSCRIBE" in the subject line.
                          </p>
                        </div>
                      </div>
                    </body>
                    </html>
                  `
                });
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Subscribed successfully' }));
              } catch (error) {
                console.error('Error processing newsletter subscription:', error);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                  message: 'Failed to process subscription',
                  error: error instanceof Error ? error.message : 'Unknown error'
                }));
              }
            });
            
            return;
          }
          
          next();
        });
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  }
});
