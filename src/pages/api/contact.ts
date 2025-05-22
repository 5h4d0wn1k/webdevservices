import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../utils/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, service, message } = req.body;

  // Validate required fields
  if (!name || !email || !service || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    console.log('Processing contact form submission from:', email);
    
    // Make sure we always send to these two main emails
    const primaryRecipients = [
      process.env.ADMIN_EMAIL || 'Shadownik(Swnk).official@gmail.com',
      'info@shadownik.online'
    ];
    
    // Add additional team recipients if needed
    if (process.env.INCLUDE_TEAM_MEMBERS === 'true') {
      primaryRecipients.push('nikhilnagpure203@gmail.com', 'aniwiss07@gmail.com');
    }

    // Send email to admin
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong> ${message}</p>
      </div>
    `;

    const adminEmailResult = await sendEmail({
      to: primaryRecipients,
      subject: `New Contact Form Submission from ${name}`,
      html: adminHtml,
    });

    console.log('Admin email result:', adminEmailResult);

    // Send confirmation email to client
    const clientHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Thank you for contacting Shadownik(Swnk)!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message regarding <strong>${service}</strong> and will get back to you shortly.</p>
        <p>Here's a copy of your message:</p>
        <p style="background-color: #f4f4f8; padding: 15px; border-left: 4px solid #4F46E5;">${message}</p>
        <p>Best regards,<br>Team Shadownik(Swnk)</p>
      </div>
    `;

    const clientEmailResult = await sendEmail({
      to: email,
      subject: 'Thank you for contacting Shadownik(Swnk)',
      html: clientHtml,
    });

    console.log('Client email result:', clientEmailResult);

    // Check if any emails failed
    if (!adminEmailResult.success || !clientEmailResult.success) {
      console.error('Email sending partially failed:', {
        adminResult: adminEmailResult,
        clientResult: clientEmailResult
      });
      return res.status(207).json({ 
        message: 'Contact form processed with partial email delivery',
        adminEmailSent: adminEmailResult.success,
        clientEmailSent: clientEmailResult.success
      });
    }

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      message: 'Failed to process your request',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 