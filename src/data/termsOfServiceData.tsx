import React from 'react';

interface TermsSection {
  heading: string;
  content: (string | string[])[]; // Can be paragraphs or lists of strings
}

interface TermsOfServiceDataType {
  title: string;
  lastUpdated: string;
  sections: TermsSection[];
  contactInfo: {
    email: string;
    phone: string;
  };
  backLinkText: string;
  backLinkHref: string;
}

export const termsOfServiceData: TermsOfServiceDataType = {
  title: "Terms of Service",
  lastUpdated: "March 15, 2024",
  sections: [
    {
      heading: "1. Introduction",
      content: [
        "Welcome to Shadownik(SWNK) Web Development Services. These Terms of Service govern your use of our website and services.",
        "By accessing or using our services, you agree to be bound by these Terms."
      ]
    },
    {
      heading: "2. Services",
      content: [
        "Shadownik(SWNK) provides web development services including but not limited to website design, development, maintenance, and related services.",
        "We reserve the right to modify or discontinue any service at any time."
      ]
    },
    {
      heading: "3. Intellectual Property",
      content: [
        "All content, designs, and materials provided by Shadownik(SWNK) remain our exclusive property.",
        "Clients retain rights to their original content and data."
      ]
    },
    {
      heading: "4. Limitation of Liability",
      content: [
        "In no event shall Shadownik(SWNK), the web development services division of Shadownik, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses."
      ]
    },
    {
      heading: "5. Changes to Terms",
      content: [
        "We reserve the right to modify or replace these Terms at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of the modified Terms."
      ]
    },
    {
      heading: "6. Contact Information",
      content: [
        "For any questions about these Terms, please contact us at:"
      ]
    }
  ],
  contactInfo: {
    email: "support@swnk.in",
    phone: "+91 9165644843",
  },
  backLinkText: "Back to Home",
  backLinkHref: "/"
}; 