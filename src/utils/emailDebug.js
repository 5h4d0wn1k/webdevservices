import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Log email configuration
const logEmailConfig = () => {
  console.log('Email Configuration:');
  console.log('- GMAIL_USER:', process.env.GMAIL_USER);
  console.log('- EMAIL_PASSWORD length:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0);
  console.log('- GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL);
  console.log('- GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);
};

// Method 1: Using Gmail with App Password
const testGmailAppPassword = async () => {
  try {
    console.log('Testing Gmail with App Password...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'shadownik.official@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    const info = await transporter.sendMail({
      from: `"Shadownik Debug" <${process.env.GMAIL_USER || 'shadownik.official@gmail.com'}>`,
      to: 'nikhilnagpure203@gmail.com',
      subject: 'Test Email - Gmail App Password',
      text: 'This is a test email sent using Gmail with App Password.',
      html: '<h1>Test Email</h1><p>This is a test email sent using Gmail with App Password.</p>',
    });
    
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email with Gmail App Password:', error);
    return false;
  }
};

// Method 2: Using SMTP directly
const testSmtpDirect = async () => {
  try {
    console.log('Testing direct SMTP connection...');
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER || 'shadownik.official@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    const info = await transporter.sendMail({
      from: `"Shadownik Debug" <${process.env.GMAIL_USER || 'shadownik.official@gmail.com'}>`,
      to: 'nikhilnagpure203@gmail.com',
      subject: 'Test Email - Direct SMTP',
      text: 'This is a test email sent using direct SMTP connection.',
      html: '<h1>Test Email</h1><p>This is a test email sent using direct SMTP connection.</p>',
    });
    
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email with direct SMTP:', error);
    return false;
  }
};

// Run all tests
export const runEmailTests = async () => {
  logEmailConfig();
  console.log('\n--- Starting Email Tests ---\n');
  
  const gmailResult = await testGmailAppPassword();
  console.log('Gmail App Password Test:', gmailResult ? 'SUCCESS' : 'FAILED');
  
  const smtpResult = await testSmtpDirect();
  console.log('Direct SMTP Test:', smtpResult ? 'SUCCESS' : 'FAILED');
  
  console.log('\n--- Email Tests Complete ---\n');
  
  return {
    gmailResult,
    smtpResult
  };
}; 