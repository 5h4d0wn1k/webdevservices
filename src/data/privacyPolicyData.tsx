import React from 'react';

interface PolicySection {
  heading: string;
  content: (string | string[])[]; // Can be paragraphs or lists of strings
}

interface PrivacyPolicyDataType {
  title: string;
  lastUpdated: string;
  sections: PolicySection[];
  contactInfo: {
    email: string;
    phone: string;
  };
  backLinkText: string;
  backLinkHref: string;
}

export const privacyPolicyData: PrivacyPolicyDataType = {
  title: "Privacy Policy",
  lastUpdated: "March 15, 2024",
  sections: [
    {
      heading: "1. Information We Collect",
      content: [
        "We collect information that you provide directly to us, including:",
        [
          "Name and contact information",
          "Account credentials",
          "Payment information",
          "Communication preferences",
        ]
      ]
    },
    {
      heading: "2. How We Use Your Information",
      content: [
        "We use the information we collect to:",
        [
          "Provide and maintain our services",
          "Process your transactions",
          "Send you technical notices and support messages",
          "Communicate with you about products, services, and events",
          "Protect against fraudulent or illegal activity",
        ]
      ]
    },
    {
      heading: "3. Information Sharing",
      content: [
        "We do not sell or rent your personal information to third parties. We may share your information with:",
        [
          "Service providers who assist in our operations",
          "Professional advisors and consultants",
          "Law enforcement when required by law",
        ]
      ]
    },
    {
      heading: "4. Your Rights and Choices",
      content: [
        "You have certain rights regarding your personal information:",
        [
          "Access your personal information",
          "Correct inaccurate information",
          "Request deletion of your information",
          "Opt-out of marketing communications",
        ]
      ]
    },
    {
      heading: "5. Contact Us",
      content: [
        "If you have any questions about this Privacy Policy, please contact us at:"
      ]
    }
  ],
  contactInfo: {
    email: "support@shadownik.online",
    phone: "+91 9165644843",
  },
  backLinkText: "Back to Home",
  backLinkHref: "/",
}; 