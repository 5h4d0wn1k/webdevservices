import React from 'react';

interface SchemaWebSite {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  potentialAction: {
    '@type': string;
    target: string;
    'query-input': string;
  };
}

interface SchemaContactPoint {
  '@type': string;
  telephone: string;
  contactType: string;
  email: string;
  availableLanguage: string[];
}

interface SchemaPostalAddress {
  '@type': string;
  addressLocality: string;
  addressCountry: string;
}

interface SchemaGeoCoordinates {
  '@type': string;
  latitude: string;
  longitude: string;
}

interface SchemaGeoCircle {
  '@type': string;
  geoMidpoint: SchemaGeoCoordinates;
  geoRadius: string;
}

interface SchemaOrganization {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
  contactPoint: SchemaContactPoint;
  slogan: string;
  description: string;
  keywords: string;
}

interface SchemaProfessionalService {
  '@context': string;
  '@type': string;
  name: string;
  image: string;
  address: SchemaPostalAddress;
  telephone: string;
  email: string;
  url: string;
  description: string;
  priceRange: string;
  openingHours: string;
  areaServed: SchemaGeoCircle;
  services: string[];
}

interface SchemaFAQPage {
  '@context': string;
  '@type': string;
  mainEntity: {
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }[];
}

interface SeoSchemaDataType {
  schemaData: SchemaWebSite;
  organizationData: SchemaOrganization;
  professionalServiceData: SchemaProfessionalService;
  faqData: SchemaFAQPage;
}

export const seoSchemaData: SeoSchemaDataType = {
  schemaData: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Shadownik(SWNK) Web Development Services",
    "url": "https://web.swnk.in",
    "description": "Professional web development services from Shadownik(SWNK), the specialized sub-division of Shadownik in IT. We offer custom websites, e-commerce solutions, web applications, and digital transformation services. Get a free consultation today.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://web.swnk.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },

  organizationData: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shadownik(SWNK)",
    "url": "https://web.swnk.in",
    "logo": "https://web.swnk.in/logo.png",
    "sameAs": [
      "https://github.com/Shadownik-official",
      "https://x.com/Shadownik_ofc",
      "https://www.linkedin.com/company/shadownik",
      "https://discord.gg/UA4yYEGx",
      "https://www.facebook.com/people/Shadownik/61562599613319",
      "https://instagram.com/Shadownik.official",
      "https://www.youtube.com/@Shadownik.official",
      "https://t.me/shadownikofficial",
      "https://www.whatsapp.com/channel/0029VakSdTtFXUuURqTLgF3A"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91 9165644843",
      "contactType": "customer service",
      "email": "support@swnk.in",
      "availableLanguage": ["English", "Hindi"]
    },
    "slogan": "Transforming Ideas into Digital Reality",
    "description": "Shadownik(SWNK) is the specialized web development services division of Shadownik, an IT leader. We provide expert custom solutions that drive business growth and digital transformation.",
    "keywords": "web development, custom websites, e-commerce, web applications, digital transformation, SEO services, mobile apps, Shadownik(SWNK), Shadownik"
  },

  professionalServiceData: {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Shadownik(SWNK) Web Development",
    "image": "https://web.swnk.in/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Remote",
      "addressCountry": "IN"
    },
    "telephone": "+91-9165644843",
    "email": "info@swnk.in",
    "url": "https://web.swnk.in",
    "description": "Shadownik(SWNK), a specialized web development division of Shadownik, provides premium web development services including custom websites, e-commerce, web applications, and digital marketing solutions. Schedule a free consultation to discuss your project.",
    "priceRange": "$$-$$$",
    "openingHours": "Mo-Fr 09:00-18:00",
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "20.5937",
        "longitude": "78.9629"
      },
      "geoRadius": "50000"
    },
    "services": [
      "Custom Website Development",
      "E-commerce Solutions",
      "Web Application Development",
      "Mobile App Development",
      "UI/UX Design",
      "Digital Marketing",
      "SEO Optimization",
      "Cloud Solutions",
      "API Integration",
      "Website Maintenance"
    ]
  },

  faqData: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What web development services does Shadownik(SWNK) offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Shadownik(SWNK), the web development services division of Shadownik, offers a comprehensive range of web development services including custom website development, e-commerce solutions, web applications, mobile app development, UI/UX design, and digital marketing services."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a website development project cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Project costs vary based on requirements, complexity, and features needed. We offer free consultations to discuss your project and provide a detailed quote. Contact us to schedule a consultation."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take to develop a website?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Development timelines typically range from 4-12 weeks depending on project complexity. Simple websites may take 4-6 weeks, while complex web applications can take 8-12 weeks or more."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide ongoing website maintenance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer comprehensive website maintenance packages including regular updates, security monitoring, performance optimization, and technical support."
        }
      }
    ]
  }
}; 