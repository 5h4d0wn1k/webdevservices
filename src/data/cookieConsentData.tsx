import React from 'react';

interface CookieTypeData {
  label: string;
  description: string;
  key: 'necessary' | 'analytics' | 'marketing' | 'preferences';
}

interface CookieConsentDataType {
  headingText: string;
  mainDescription: string;
  cookieTypes: CookieTypeData[];
  buttonLabels: {
    close: string;
    customize: string;
    hideDetails: string;
    rejectAll: string;
    savePreferences: string;
    acceptAll: string;
  };
  privacyFooter: {
    text: string;
    privacyPolicyLinkText: string;
    privacyPolicyLinkHref: string;
    termsOfServiceLinkText: string;
    termsOfServiceLinkHref: string;
  };
}

export const cookieConsentData: CookieConsentDataType = {
  headingText: "Cookie Preferences",
  mainDescription: "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking \"Accept All\", you consent to our use of cookies.",
  cookieTypes: [
    {
      key: 'necessary',
      label: 'Necessary',
      description: 'Essential for the website to function properly.'
    },
    {
      key: 'analytics',
      label: 'Analytics',
      description: 'Helps us understand how visitors interact with our website.'
    },
    {
      key: 'marketing',
      label: 'Marketing',
      description: 'Used to track visitors across websites for advertising purposes.'
    },
    {
      key: 'preferences',
      label: 'Preferences',
      description: 'Enables the website to remember your preferences.'
    }
  ],
  buttonLabels: {
    close: "Close cookie consent dialog",
    customize: "Customize",
    hideDetails: "Hide Details",
    rejectAll: "Reject All",
    savePreferences: "Save Preferences",
    acceptAll: "Accept All",
  },
  privacyFooter: {
    text: "Your privacy is important to us",
    privacyPolicyLinkText: "Privacy Policy",
    privacyPolicyLinkHref: "/privacy-policy",
    termsOfServiceLinkText: "Terms of Service",
    termsOfServiceLinkHref: "/terms-of-service",
  }
}; 