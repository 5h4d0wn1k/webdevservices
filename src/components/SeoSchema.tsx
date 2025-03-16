import React from 'react';

const SeoSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Shadownik Web Development Services",
    "url": "https://web.shadownik.online",
    "description": "Professional web development services including custom websites, e-commerce solutions, web applications, and digital transformation services. Get a free consultation today.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://web.shadownik.online/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shadownik",
    "url": "https://shadownik.com",
    "logo": "https://shadownik.com/logo.png",
    "sameAs": [
      "https://github.com/Shadownik-official",
      "https://x.com/Shadownik_ofc",
      "https://www.linkedin.com/company/shadownik",
      "https://discord.gg/UA4yYEGx",
      "https://www.facebook.com/people/Shadownik/61562599613319",
      "https://instagram.com/Shadownik.official",
      "https://www.youtube.com/@Shadownik.official",
      "https://t.me/shadownikofficial",
      "https://www.whatsapp.com/channel/0029VakSdtTfXUuURqTLgF3A"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "email": "info@shadownik.online",
      "availableLanguage": ["English"]
    },
    "slogan": "Transforming Ideas into Digital Reality",
    "description": "Expert web development company specializing in custom solutions that drive business growth and digital transformation.",
    "keywords": "web development, custom websites, e-commerce, web applications, digital transformation, SEO services, mobile apps"
  };

  const professionalServiceData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Shadownik Web Development",
    "image": "https://web.shadownik.online/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "telephone": "+1-555-123-4567",
    "email": "info@shadownik.online",
    "url": "https://web.shadownik.online",
    "description": "Shadownik provides premium web development services including custom websites, e-commerce, web applications, and digital marketing solutions. Schedule a free consultation to discuss your project.",
    "priceRange": "$$-$$$",
    "openingHours": "Mo-Fr 09:00-18:00",
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "37.7749",
        "longitude": "-122.4194"
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
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Web Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Website Development",
            "description": "Professional custom website development tailored to your business needs"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "E-commerce Solutions",
            "description": "Full-featured online store development with secure payment integration"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Web Application Development",
            "description": "Custom web application development for business process automation"
          }
        }
      ]
    }
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What web development services does Shadownik offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Shadownik offers a comprehensive range of web development services including custom website development, e-commerce solutions, web applications, mobile app development, UI/UX design, and digital marketing services."
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
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }} />
    </>
  );
};

export default SeoSchema; 