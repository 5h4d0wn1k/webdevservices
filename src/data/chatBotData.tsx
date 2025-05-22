import React from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string; // Store as string or handle Date objects differently
}

interface ChatBotDataType {
  defaultMessages: Message[];
  botResponses: Record<string, string[]>;
  openButtonAriaLabel: string;
  closeButtonAriaLabel: string;
  headerTitle: string;
  headerStatus: string;
  inputPlaceholder: string;
}

export const chatBotData: ChatBotDataType = {
  defaultMessages: [
    {
      id: '1',
      content: "Hi there! I'm the Shadownik(Swnk) Assistant, your guide to our web development services. How can I help you today?", // Updated text
      sender: 'bot',
      timestamp: new Date().toISOString(), // Store as ISO string
    }
  ],
  botResponses: {
    pricing: [
      "Our pricing for web development services is customized based on your project requirements and the scope of work.",
      "For a simple website, prices might start around $2,500. More complex web applications or e-commerce solutions typically range from $5,000 to $20,000+.",
      "To get an accurate quote, we recommend scheduling a free consultation to discuss your specific needs."
    ],
    contact: [
      "You can contact our Shadownik(Swnk) team for web development inquiries at support@shadownik.online or call us at +91 9165644843.",
      "You can also find a contact form on our website where you can leave your details and project brief. We aim to respond within 24 hours."
    ],
    services: [
      "As Shadownik(Swnk), the web development division of Shadownik, we specialize in a range of web services including custom website development, e-commerce solutions, web applications, UI/UX design, and performance optimization.",
      "Are you looking for details on a particular service?"
    ],
    timeline: [
      "The timeline for a web development project with Shadownik(Swnk) depends on its complexity.",
      "Simple websites usually take 2-4 weeks. More complex web applications might take 2-3 months or longer.",
      "We can give you a clearer estimate after we understand the specifics of your project during a consultation."
    ],
    portfolio: [
      "You can explore our portfolio right here on the website to see examples of the web development projects Shadownik(Swnk) has completed for clients across various sectors.",
      "Let me know if you'd like to see case studies for a specific type of project or industry."
    ],
    process: [
      "Our web development process at Shadownik(Swnk) follows a structured approach: discovery, planning, design, development, testing, and deployment.",
      "We use agile methodologies to ensure flexibility and include regular client feedback sessions throughout the project."
    ],
    technologies: [
      "For web development, Shadownik(Swnk) utilizes modern technologies such as React, Angular, Vue.js for frontend, and Node.js, Python, PHP for backend.",
      "We also work with popular CMS platforms like WordPress and e-commerce platforms like Shopify."
    ],
    seo: [
      "Yes, Shadownik(Swnk) provides comprehensive SEO services specifically for websites. This includes on-page optimization, technical audits, content strategy, and ongoing monitoring.",
      "Our goal is to improve your website's visibility and ranking on search engines for long-term success."
    ],
    hosting: [
      "Shadownik(Swnk) can assist with hosting solutions for the websites we develop. We offer packages that include essential maintenance, security, and performance monitoring.",
      "If you have a preferred cloud provider like AWS, Google Cloud, or DigitalOcean, we can help set up and manage your hosting there as well."
    ],
    support: [
      "We offer ongoing support and maintenance for the web development projects we deliver.",
      "Our standard support covers updates, security patches, and technical assistance. Custom support plans are also available based on your needs."
    ]
  },
  openButtonAriaLabel: "Open chat",
  closeButtonAriaLabel: "Close chat",
  headerTitle: "Shadownik(Swnk) Assistant", // Updated title
  headerStatus: "Online | Typically replies instantly",
  inputPlaceholder: "Type your message...",
}; 