# Deploying to Vercel

This document contains instructions for deploying your swnk Web Services application to Vercel.

## Prerequisites

1. A Vercel account
2. Your GitHub repository connected to Vercel
3. Access to all required environment variables

## Deployment Steps

1. **Log in to Vercel** and create a new project
2. **Import your GitHub repository**
3. **Configure the project:**
   - Framework Preset: Next.js
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## Required Environment Variables

Add the following environment variables to your Vercel project:

```
# API Keys
RESEND_API_KEY=your_resend_api_key

# Email Configuration
EMAIL_DOMAIN=web.swnk.in
ADMIN_EMAIL=sales@swnk.in
INFO_EMAIL=info@swnk.in
INCLUDE_TEAM_MEMBERS=true

# Website Configuration
LOGO_URL=https://swnk.in/logo.svg
WEBSITE_URL=https://swnk.in

# Google Calendar API
GOOGLE_CREDENTIALS_TYPE=service_account
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_PRIVATE_KEY=your_private_key
GOOGLE_CLIENT_EMAIL=your_client_email
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_CLIENT_X509_CERT_URL=your_cert_url
GOOGLE_UNIVERSE_DOMAIN=googleapis.com
GOOGLE_CALENDAR_KEY=your_calendar_key
GOOGLE_MEET_LINK=your_default_meet_link
```

## Important Notes

1. **Environment Variables**: 
   - Copy all environment variables from your `.env` file to Vercel
   - Make sure to handle sensitive information carefully
   - For multi-line values like `GOOGLE_PRIVATE_KEY`, replace newlines with `\n`

2. **API Routes**:
   - All API functionality is implemented in `/src/pages/api/`
   - The serverless functions will handle:
     - Contact form submissions
     - Newsletter subscriptions
     - Consultation bookings
     - Project submissions

3. **Logo and Assets**:
   - Upload your logo to a publicly accessible URL
   - Update the `LOGO_URL` environment variable accordingly

4. **Custom Domain**:
   - Configure your custom domain in Vercel settings
   - Update DNS records as instructed by Vercel

## Troubleshooting

- **Build Failures**: Check the build logs in Vercel for specific errors
- **API Errors**: Monitor function logs in the Vercel dashboard
- **Email Issues**: Verify Resend API key and configuration
- **Calendar Issues**: Ensure Google Calendar API credentials are correctly formatted

## Monitoring

After deployment, monitor the following:
- Function invocations and errors in Vercel dashboard
- Email delivery status in Resend dashboard
- Calendar event creation in Google Calendar

## Need Help?

If you encounter issues during deployment, contact the development team at support@swnk.in 