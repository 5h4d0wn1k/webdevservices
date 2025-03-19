import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../utils/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return res.status(400).json({ message: 'Valid email is required' });
  }

  try {
    console.log('Processing newsletter subscription for:', email);

    // Notify admin about new newsletter subscription
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">New Newsletter Subscription</h2>
        <p>A new user has subscribed to the newsletter:</p>
        <p><strong>Email:</strong> ${email}</p>
      </div>
    `;

    const adminResult = await sendEmail({
      to: ["shadownik.official@gmail.com"],
      subject: 'New Newsletter Subscription',
      html: adminHtml
    });

    // Send confirmation to subscriber
    const subscriberHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to Shadownik Newsletter!</h2>
        <p>Thank you for subscribing to our newsletter. You'll now receive updates on:</p>
        <ul>
          <li>Web development trends</li>
          <li>Special offers and discounts</li>
          <li>Industry insights and tips</li>
          <li>Company news and updates</li>
        </ul>
        <p>Best regards,<br>Team Shadownik</p>
      </div>
    `;

    const subscriberResult = await sendEmail({
      to: email,
      subject: 'Welcome to Shadownik Newsletter',
      html: subscriberHtml
    });

    console.log('Newsletter email results:', { adminResult, subscriberResult });

    return res.status(200).json({ 
      message: 'Subscription successful',
      success: true
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ 
      message: 'Failed to process newsletter subscription',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 