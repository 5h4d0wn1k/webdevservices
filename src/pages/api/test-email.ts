import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmailToMultipleRecipients } from '../../utils/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests for testing
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Simple HTML for test email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Test Email from Shadownik(Swnk)</h2>
        <p>This is a test email to verify that the email sending functionality is working correctly.</p>
        <p>If you received this email, it means that your email configuration is working properly!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      </div>
    `;

    // Send test email to each recipient individually using the emailService utility
    const recipients = ["Shadownik(Swnk).official@gmail.com", "nikhilnagpure203@gmail.com", "aniwiss07@gmail.com"];
    
    const emailResults = await sendEmailToMultipleRecipients({
      to: recipients,
      subject: 'Test Email from Shadownik(Swnk) API',
      html: html,
    });

    console.log('Email sending results:', emailResults);
    
    const allSuccessful = emailResults.every(result => result.success);
    
    if (allSuccessful) {
      return res.status(200).json({ 
        message: 'Test emails sent successfully',
        recipients: recipients,
        results: emailResults
      });
    } else {
      // Some emails failed
      return res.status(207).json({ 
        message: 'Some test emails failed to send',
        recipients: recipients,
        results: emailResults
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    return res.status(500).json({ 
      message: 'Failed to send test emails',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 