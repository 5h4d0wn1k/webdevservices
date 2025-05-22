import { Resend } from 'resend';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.EMAIL_DOMAIN || 'shadownik.online';
const mainAdminEmail = process.env.ADMIN_EMAIL || 'Shadownik(Swnk).official@gmail.com';
const infoEmail = process.env.INFO_EMAIL || 'info@shadownik.online';

/**
 * Sends an email using Resend
 * @param options Email options including recipients, subject, and HTML content
 * @returns Object with success status and messageId or error message
 */
export const sendEmail = async (options: EmailOptions): Promise<SendEmailResult> => {
  try {
    // Prepare recipients
    const { to, cc, bcc, subject, html, replyTo } = options;
    
    console.log(`Original recipients - to: ${JSON.stringify(to)}, cc: ${JSON.stringify(cc)}, bcc: ${JSON.stringify(bcc)}`);
    
    // Ensure both main admin emails receive copies of all emails
    let finalBcc: string[] = [];
    
    // If original bcc is provided, add it to finalBcc
    if (bcc) {
      if (Array.isArray(bcc)) {
        finalBcc = [...bcc];
      } else {
        finalBcc = [bcc];
      }
    }
    
    // Always add the main admin email if not already in recipients
    if (!finalBcc.includes(mainAdminEmail) && 
        !(Array.isArray(to) && to.includes(mainAdminEmail)) && 
        to !== mainAdminEmail) {
      finalBcc.push(mainAdminEmail);
    }
    
    // Always add the info email if not already in recipients
    if (!finalBcc.includes(infoEmail) && 
        !(Array.isArray(to) && to.includes(infoEmail)) && 
        to !== infoEmail) {
      finalBcc.push(infoEmail);
    }
    
    console.log(`Final recipients - to: ${JSON.stringify(to)}, bcc: ${JSON.stringify(finalBcc)}`);
    
    // Prepare tags for Resend analytics
    const tags = [];
    if (subject.includes('Contact Form')) {
      tags.push({ name: 'contact_form', value: 'true' });
    } else if (subject.includes('Consultation')) {
      tags.push({ name: 'consultation', value: 'true' });
    } else if (subject.includes('Newsletter')) {
      tags.push({ name: 'newsletter', value: 'true' });
    }
    
    const fromAddress = `Shadownik(Swnk) <no-reply@${domain}>`;
    console.log(`Sending email from: ${fromAddress}`);
    
    const emailResponse = await resend.emails.send({
      from: fromAddress,
      to,
      cc,
      bcc: finalBcc.length > 0 ? finalBcc : undefined,
      replyTo: replyTo || `contact@${domain}`,
      subject,
      html,
      tags: tags.length > 0 ? tags : undefined
    });
    
    console.log('Email sent successfully:', emailResponse);
    return { 
      success: true, 
      messageId: emailResponse.id || 'unknown'
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Sends an email to multiple recipients individually
 * @param options Email options including recipients, subject, and HTML content
 * @returns Array of results for each recipient
 */
export const sendEmailToMultipleRecipients = async (options: EmailOptions): Promise<SendEmailResult[]> => {
  const { to, ...restOptions } = options;
  const recipients = Array.isArray(to) ? to : [to];
  
  const results = await Promise.all(
    recipients.map(async (recipient) => {
      try {
        const result = await sendEmail({
          ...restOptions,
          to: recipient,
        });
        return result;
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
    })
  );
  
  return results;
};

/**
 * Generates HTML for a project submission email
 * @param formData Project submission form data
 * @returns HTML string for the email
 */
export const generateProjectSubmissionEmail = (formData: any) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">New Project Submission</h2>
      <p>Thank you for submitting your project details. We'll review your requirements and get back to you shortly.</p>
      
      <h3 style="color: #4F46E5;">Project Overview</h3>
      <p><strong>Project Type:</strong> ${formData.projectType}</p>
      
      <h3 style="color: #4F46E5;">Business Information</h3>
      <p><strong>Business Name:</strong> ${formData.businessInfo.name}</p>
      <p><strong>Industry:</strong> ${formData.businessInfo.industry}</p>
      <p><strong>Company Size:</strong> ${formData.businessInfo.size}</p>
      <p><strong>Current Website:</strong> ${formData.businessInfo.website || 'None'}</p>
      
      <h3 style="color: #4F46E5;">Project Requirements</h3>
      <p><strong>Features:</strong></p>
      <ul>
        ${formData.requirements.features.map((feature: string) => `<li>${feature}</li>`).join('')}
      </ul>
      <p><strong>Design Preferences:</strong> ${formData.requirements.design}</p>
      <p><strong>Timeline:</strong> ${formData.requirements.timeline}</p>
      <p><strong>Budget Range:</strong> ${formData.requirements.budget}</p>
      
      <h3 style="color: #4F46E5;">Technical Requirements</h3>
      <p><strong>Technologies:</strong></p>
      <ul>
        ${formData.technical.technologies.map((tech: string) => `<li>${tech}</li>`).join('')}
      </ul>
      <p><strong>Hosting Preference:</strong> ${formData.technical.hosting}</p>
      <p><strong>Domain Status:</strong> ${formData.technical.domain}</p>
      
      <p style="margin-top: 20px;">We'll be in touch within 24 hours to discuss your project in detail.</p>
      
      <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  `;
};

/**
 * Generates HTML for a consultation confirmation email
 * @param bookingData Consultation booking data
 * @returns HTML string for the email
 */
export const generateConsultationConfirmationEmail = (bookingData: any) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">Consultation Scheduled</h2>
      <p>Your consultation has been successfully scheduled. Here are the details:</p>
      
      <h3 style="color: #4F46E5;">Consultation Details</h3>
      <p><strong>Date:</strong> ${new Date(bookingData.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${bookingData.time}</p>
      <p><strong>Project Type:</strong> ${bookingData.projectType}</p>
      <p><strong>Budget Range:</strong> ${bookingData.budget}</p>
      
      <h3 style="color: #4F46E5;">Contact Information</h3>
      <p><strong>Name:</strong> ${bookingData.name}</p>
      <p><strong>Email:</strong> ${bookingData.email}</p>
      <p><strong>Phone:</strong> ${bookingData.phone}</p>
      
      <p style="margin-top: 20px;">We look forward to discussing your project!</p>
      
      <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  `;
}; 