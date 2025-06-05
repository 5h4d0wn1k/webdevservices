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
    
    // Get admin recipients from environment variables
    const adminRecipients = [
      process.env.ADMIN_EMAIL || 'sales@swnk.in',
      process.env.INFO_EMAIL || 'info@swnk.in'
    ];
    
    console.log('Sending newsletter notification to:', adminRecipients);

    // Use environment variable for logo URL with a fallback
    const logoUrl = process.env.LOGO_URL || 'https://web.swnk.in/logo.svg';

    // Notify admin about new newsletter subscription
    const adminHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Newsletter Subscription</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .header img { height: 40px; margin-bottom: 15px; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background-color: #fff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eaeaea; }
          .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; padding: 20px; }
          .footer img { height: 28px; margin-bottom: 15px; }
        </style>
      </head>
      <body style="background-color: #f5f5f7; margin: 0; padding: 20px;">
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Shadownik(Swnk) Logo">
            <h1>New Newsletter Subscription</h1>
          </div>
          <div class="content">
            <h2 style="color: #4F46E5; margin-top: 0;">Subscription Details</h2>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #4F46E5;">${email}</a></p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Source:</strong> Website Newsletter Form</p>
            
            <div style="background-color: #f9f9fb; border-radius: 8px; padding: 20px; margin-top: 20px; border-left: 4px solid #4F46E5;">
              <h3 style="color: #4F46E5; margin-top: 0;">Recommended Actions:</h3>
              <ul style="padding-left: 20px;">
                <li>Add this email to your newsletter distribution list</li>
                <li>Consider sending a personalized welcome message</li>
                <li>Include this subscriber in your next newsletter campaign</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <img src="${logoUrl}" alt="Shadownik(Swnk)">
            <p>© ${new Date().getFullYear()} Shadownik(Swnk). All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const adminResult = await sendEmail({
      to: adminRecipients,
      subject: 'New Newsletter Subscription',
      html: adminHtml
    });

    // Send confirmation to subscriber
    const subscriberHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Shadownik(Swnk) Newsletter</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .header img { height: 40px; margin-bottom: 15px; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background-color: #fff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eaeaea; }
          .feature-box { background-color: #f9f9fb; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #4F46E5; }
          .button { display: inline-block; background: linear-gradient(90deg, #4F46E5, #7C3AED); color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; padding: 20px; }
          .footer img { height: 28px; margin-bottom: 15px; }
        </style>
      </head>
      <body style="background-color: #f5f5f7; margin: 0; padding: 20px;">
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Shadownik(Swnk) Logo">
            <h1>Welcome to Shadownik(Swnk) Newsletter!</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Thank you for subscribing to our newsletter! We're thrilled to have you join our community of forward-thinking businesses and tech enthusiasts.</p>
            
            <div class="feature-box">
              <h2 style="color: #4F46E5; margin-top: 0;">What You'll Receive:</h2>
              <ul>
                <li><strong>Web Development Insights:</strong> Best practices and trends</li>
                <li><strong>Exclusive Content:</strong> Articles and guides before anyone else</li>
                <li><strong>Case Studies:</strong> Real-world success stories</li>
                <li><strong>Special Offers:</strong> Promotions exclusive to subscribers</li>
              </ul>
            </div>
            
            <p>We send newsletters approximately twice a month and promise not to spam your inbox.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://www.shadownik.online" class="button">Explore Our Services</a>
            </div>
            
            <p style="margin-top: 30px;">Looking forward to sharing valuable insights with you,</p>
            <p style="margin: 0; font-weight: bold;">The Shadownik(Swnk) Team</p>
          </div>
          <div class="footer">
            <img src="${logoUrl}" alt="Shadownik(Swnk)">
            <p>© ${new Date().getFullYear()} Shadownik(Swnk). All rights reserved.</p>
            <p style="font-size: 12px; color: #999;">To unsubscribe, please reply to this email with "UNSUBSCRIBE" in the subject line.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const subscriberResult = await sendEmail({
      to: email,
      subject: 'Welcome to Shadownik(Swnk) Newsletter',
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