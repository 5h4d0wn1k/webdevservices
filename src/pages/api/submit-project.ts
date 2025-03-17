import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail, generateProjectSubmissionEmail } from '../../utils/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const formData = req.body;

    // Send confirmation email to client
    const clientEmailSent = await sendEmail({
      to: formData.businessInfo.email,
      subject: 'Project Submission Confirmation',
      html: generateProjectSubmissionEmail(formData),
    });

    // Send notification to admin
    const adminEmailSent = await sendEmail({
      to: process.env.ADMIN_EMAIL || '',
      subject: 'New Project Submission',
      html: generateProjectSubmissionEmail(formData),
    });

    if (!clientEmailSent || !adminEmailSent) {
      throw new Error('Failed to send emails');
    }

    res.status(200).json({ message: 'Project submitted successfully' });
  } catch (error) {
    console.error('Error submitting project:', error);
    res.status(500).json({ message: 'Failed to submit project' });
  }
} 