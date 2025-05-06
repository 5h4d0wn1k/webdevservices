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

    // Get admin recipients from environment variables with fallbacks
    const adminRecipients = [
      'swnk.official@gmail.com', // Always include main admin email
      process.env.INFO_EMAIL || 'info@swnk.in'
    ];
    
    // Include team members if configured
    if (process.env.INCLUDE_TEAM_MEMBERS === 'true' && process.env.TEAM_EMAILS) {
      const teamEmails = process.env.TEAM_EMAILS.split(',');
      adminRecipients.push(...teamEmails);
    }
    
    console.log('Sending project submission notification to:', adminRecipients);

    // Use environment variable for logo URL with a fallback
    const logoUrl = process.env.LOGO_URL || 'https://swnk.in/logo.svg';

    // Common HTML styles for emails
    const emailStyles = `
      body { font-family: 'Arial', sans-serif; color: #333; line-height: 1.6; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(90deg, #4F46E5, #7C3AED); padding: 30px 20px; border-radius: 10px 10px 0 0; text-align: center; }
      .header img { height: 40px; margin-bottom: 15px; }
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
      .footer img { height: 28px; margin-bottom: 15px; }
      .meeting-box { background-color: #f9f9f9; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px; margin: 20px 0; }
      .meeting-details { margin-bottom: 20px; }
      .join-button { display: inline-block; background: linear-gradient(90deg, #4F46E5, #7C3AED); color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 10px; }
    `;

    // Template for admin email
    const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Project Submission</title>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 650px; margin: 0 auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 25px; text-align: center; color: white; }
        .content { padding: 30px; }
        .section { margin-bottom: 25px; }
        .section h2 { color: #4F46E5; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 0; }
        table { width: 100%; border-collapse: collapse; }
        table td { padding: 8px 0; }
        table td:first-child { font-weight: bold; width: 200px; color: #555; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="swnk Logo" style="height: 40px; margin-bottom: 15px;">
          <h1 style="margin: 0; font-size: 24px;">New Project Submission</h1>
        </div>
        
        <div class="content">
          <div class="section">
            <h2>Business Information</h2>
            <table>
              <tr>
                <td>Business Name:</td>
                <td>${formData.businessInfo.name}</td>
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
          <div class="section meeting-box">
            <h2>Consultation Scheduled</h2>
            <div class="meeting-details">
              <p><strong>Date:</strong> ${new Date(formData.consultation.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p><strong>Time:</strong> ${formData.consultation.time}</p>
              <p><strong>Client Name:</strong> ${formData.consultation.name || formData.businessInfo.name}</p>
              <p><strong>Client Email:</strong> ${formData.consultation.email || formData.businessInfo.email}</p>
              <p><strong>Client Phone:</strong> ${formData.consultation.phone || 'Not provided'}</p>
            </div>
            
            ${formData.consultation.meetLink ? `
            <p>Google Meet Link: <a href="${formData.consultation.meetLink}">${formData.consultation.meetLink}</a></p>
            ` : ''}
          </div>
          ` : ''}
          
          <p>This submission requires action. Please review the requirements and follow up with the client.</p>
        </div>
        <div class="footer">
          <img src="${logoUrl}" alt="swnk">
          <p>© ${new Date().getFullYear()} swnk Web Development Services. All rights reserved.</p>
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
      <meta charset="UTF-8">
      <title>Your Project Submission</title>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 650px; margin: 0 auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 25px; text-align: center; color: white; }
        .content { padding: 30px; }
        .section { margin-bottom: 25px; }
        .section h2 { color: #4F46E5; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 0; }
        .next-steps { background-color: #f0f4ff; padding: 20px; border-radius: 8px; margin-top: 30px; }
        .next-steps h2 { color: #4F46E5; margin-top: 0; }
        .next-steps ul { margin: 15px 0 0; padding: 0 0 0 20px; }
        .next-steps li { padding: 5px 0; }
        .button { display: inline-block; background: linear-gradient(to right, #4F46E5, #7C3AED); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="swnk Logo" style="height: 40px; margin-bottom: 15px;">
          <h1 style="margin: 0; font-size: 24px;">Thank You for Your Project Submission</h1>
        </div>
        
        <div class="content">
          <p>Dear ${formData.businessInfo.name},</p>
          
          <p>Thank you for submitting your project details to swnk. We're excited to learn more about your project and help bring your vision to life.</p>
          
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
          
          <p>If you have any questions before then, feel free to reach out to us at <a href="mailto:info@swnk.in">info@swnk.in</a>.</p>
          
          <p>We look forward to working with you!</p>
          
          <p>Best regards,<br>The swnk Team</p>
        </div>
        <div class="footer">
          <img src="${logoUrl}" alt="swnk">
          <p>© ${new Date().getFullYear()} swnk Web Development Services. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send admin notification
    const adminResult = await sendEmail({
      to: adminRecipients,
      subject: `New Project Submission: ${formData.businessInfo.name} - ${formData.projectType}`,
      html: adminHtml,
    });

    console.log('Admin notification result:', adminResult);

    // Send confirmation to client
    const clientResult = await sendEmail({
      to: formData.businessInfo.email,
      subject: 'Your Project Request - swnk Web Development Services',
      html: clientHtml,
    });

    console.log('Client confirmation result:', clientResult);

    return res.status(200).json({
      message: 'Project submission received successfully',
      success: true
    });
  } catch (error) {
    console.error('Error processing project submission:', error);
    return res.status(500).json({
      message: 'Failed to process project submission',
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
} 