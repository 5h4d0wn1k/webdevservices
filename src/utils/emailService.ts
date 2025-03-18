import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@shadownik.online',
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"Shadownik Web Development" <info@shadownik.online>`,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

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