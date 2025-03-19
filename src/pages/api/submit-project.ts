import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../utils/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const formData = req.body;

  try {
    console.log('Processing project submission...');

    // Format values for email display
    const formatFeatures = (features: string[]) => {
      if (!features || !features.length) return '<em>None specified</em>';
      return features.map(feature => `<li>${feature}</li>`).join('');
    };

    const formatTechnologies = (technologies: string[]) => {
      if (!technologies || !technologies.length) return '<em>None specified</em>';
      return technologies.map(tech => `<li>${tech}</li>`).join('');
    };

    // Common HTML styles for emails
    const emailStyles = `
      body { font-family: 'Arial', sans-serif; color: #333; line-height: 1.6; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(90deg, #4F46E5, #7C3AED); padding: 30px 20px; border-radius: 10px 10px 0 0; text-align: center; }
      .header h1 { color: white; margin: 0; font-size: 24px; }
      .content { background-color: #fff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eaeaea; border-top: none; }
      .section { margin-bottom: 20px; }
      .section h2 { color: #4F46E5; font-size: 18px; margin: 15px 0 10px 0; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
      table td { padding: 8px; border-bottom: 1px solid #eaeaea; }
      table td:first-child { font-weight: bold; width: 150px; vertical-align: top; }
      .features-list, .technologies-list { padding-left: 20px; margin: 5px 0 15px 0; }
      .features-list li, .technologies-list li { margin-bottom: 5px; }
      .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
      .meeting-box { background-color: #f9f9f9; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px; margin: 20px 0; }
      .meeting-details { margin-bottom: 20px; }
      .join-button { display: inline-block; background: linear-gradient(90deg, #4F46E5, #7C3AED); color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 10px; }
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
          <h1>New Project Submission</h1>
        </div>
        <div class="content">
          <p>A new client has submitted a project for Shadownik Web Development Services.</p>
          
          <div class="section">
            <h2>Project Overview</h2>
            <table>
              <tr>
                <td>Project Type:</td>
                <td>${formData.projectType}</td>
              </tr>
            </table>
          </div>
          
          <div class="section">
            <h2>Business Information</h2>
            <table>
              <tr>
                <td>Business Name:</td>
                <td>${formData.businessInfo.name}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>${formData.businessInfo.email}</td>
              </tr>
              <tr>
                <td>Industry:</td>
                <td>${formData.businessInfo.industry}</td>
              </tr>
              <tr>
                <td>Company Size:</td>
                <td>${formData.businessInfo.size}</td>
              </tr>
              <tr>
                <td>Current Website:</td>
                <td>${formData.businessInfo.website || 'None'}</td>
              </tr>
            </table>
          </div>
          
          <div class="section">
            <h2>Project Requirements</h2>
            <table>
              <tr>
                <td>Features:</td>
                <td>
                  <ul class="features-list">
                    ${formatFeatures(formData.requirements.features)}
                  </ul>
                </td>
              </tr>
              <tr>
                <td>Design Preferences:</td>
                <td>${formData.requirements.design}</td>
              </tr>
              <tr>
                <td>Timeline:</td>
                <td>${formData.requirements.timeline}</td>
              </tr>
              <tr>
                <td>Budget Range:</td>
                <td>${formData.requirements.budget}</td>
              </tr>
            </table>
          </div>
          
          <div class="section">
            <h2>Technical Requirements</h2>
            <table>
              <tr>
                <td>Technologies:</td>
                <td>
                  <ul class="technologies-list">
                    ${formatTechnologies(formData.technical.technologies)}
                  </ul>
                </td>
              </tr>
              <tr>
                <td>Hosting Preference:</td>
                <td>${formData.technical.hosting}</td>
              </tr>
              <tr>
                <td>Domain Status:</td>
                <td>${formData.technical.domain}</td>
              </tr>
            </table>
          </div>
          
          ${formData.consultation && formData.consultation.date ? `
          <div class="section">
            <h2>Consultation Details</h2>
            <table>
              <tr>
                <td>Name:</td>
                <td>${formData.consultation.name}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>${formData.consultation.email}</td>
              </tr>
              <tr>
                <td>Phone:</td>
                <td>${formData.consultation.phone}</td>
              </tr>
              <tr>
                <td>Date:</td>
                <td>${new Date(formData.consultation.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</td>
              </tr>
              <tr>
                <td>Time:</td>
                <td>${formData.consultation.time}</td>
              </tr>
              <tr>
                <td>Message:</td>
                <td>${formData.consultation.message || 'None provided'}</td>
              </tr>
            </table>
            
            ${formData.consultation.meetLink ? `
            <div class="meeting-box">
              <h2>Google Meet Link</h2>
              <p>A Google Meet has been scheduled for this consultation.</p>
              <a href="${formData.consultation.meetLink}" class="join-button">Join Google Meet</a>
              <p><small>Or copy this link: ${formData.consultation.meetLink}</small></p>
            </div>
            ` : ''}
          </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Shadownik Web Development Services</p>
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
          <h1>Your Project Request - Shadownik</h1>
        </div>
        <div class="content">
          <p>Dear ${formData.businessInfo.name},</p>
          
          <p>Thank you for submitting your project details to Shadownik Web Development Services. We've received your information and are excited to help bring your vision to life!</p>
          
          <div class="section">
            <h2>Project Summary</h2>
            <p>You've requested a <strong>${formData.projectType}</strong> with the following details:</p>
            
            <h3>Selected Features:</h3>
            <ul class="features-list">
              ${formatFeatures(formData.requirements.features)}
            </ul>
            
            <p><strong>Timeline:</strong> ${formData.requirements.timeline}</p>
            <p><strong>Budget Range:</strong> ${formData.requirements.budget}</p>
          </div>
          
          ${formData.consultation && formData.consultation.date ? `
          <div class="section meeting-box">
            <h2>Your Scheduled Consultation</h2>
            <p>We've scheduled a consultation to discuss your project in detail:</p>
            <div class="meeting-details">
              <p><strong>Date:</strong> ${new Date(formData.consultation.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p><strong>Time:</strong> ${formData.consultation.time}</p>
              <p><strong>Duration:</strong> 30 minutes</p>
              <p><strong>Meeting Type:</strong> Google Meet (Video Conference)</p>
            </div>
            
            ${formData.consultation.meetLink ? `
            <p>You'll be meeting with our team including our Founder & CEO and Web Development Lead.</p>
            <a href="${formData.consultation.meetLink}" class="join-button">Join Google Meet</a>
            <p><small>Or copy this link: ${formData.consultation.meetLink}</small></p>
            ` : ''}
          </div>
          ` : ''}
          
          <div class="section">
            <h2>What's Next?</h2>
            <p>Here's what you can expect:</p>
            <ol>
              <li>Our team will review your project requirements in detail</li>
              <li>We'll prepare a preliminary proposal based on your needs</li>
              <li>
                ${formData.consultation && formData.consultation.date 
                  ? `We'll discuss the proposal during our scheduled consultation`
                  : `We'll reach out to schedule a consultation to discuss your project further`
                }
              </li>
              <li>After our discussion, we'll refine the proposal and provide a detailed timeline and cost estimate</li>
            </ol>
          </div>
          
          <p>If you have any questions or need to provide additional information before our consultation, please don't hesitate to reach out to us at <a href="mailto:info@shadownik.online">info@shadownik.online</a>.</p>
          
          <p>We're looking forward to working with you!</p>
          
          <p>Best regards,<br>Team Shadownik</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Shadownik Web Development Services</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send email to admin team members individually
    const adminRecipients = [
      "shadownik.official@gmail.com",
      "nikhilnagpure203@gmail.com",
      "aniwiss07@gmail.com"
    ];

    // Send emails to all admin recipients
    for (const recipient of adminRecipients) {
      const adminEmailResult = await sendEmail({
        to: recipient,
        subject: `New Project Submission: ${formData.projectType} - ${formData.businessInfo.name}`,
        html: adminHtml
      });
      
      console.log(`Admin email sent to ${recipient}:`, adminEmailResult);
    }

    // Send confirmation email to client
    const clientEmailResult = await sendEmail({
      to: formData.businessInfo.email,
      subject: 'Your Project Request Confirmation - Shadownik',
      html: clientHtml
    });
    
    console.log('Client confirmation email sent:', clientEmailResult);

    // Return success response
    return res.status(200).json({ 
      message: 'Project submitted successfully',
      success: true
    });
  } catch (error) {
    console.error('Project submission error:', error);
    return res.status(500).json({ 
      message: 'Failed to submit project', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 