import React from 'react';

const SeoSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Shadownik(SWNK) Web Development Services",
    "url": "https://web.swnk.in",
    "description": "Professional web development services including custom websites, e-commerce solutions, web applications, and digital transformation services. Get a free consultation today.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://web.swnk.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shadownik(SWNK)",
    "url": "https://web.swnk.in",
    "logo": "https://web.swnk.in/logo.png",
    "sameAs": [
      "https://github.com/Shadownik(SWNK)-official",
      "https://x.com/Shadownik(SWNK)_ofc",
      "https://www.linkedin.com/company/Shadownik(SWNK)",
      "https://discord.gg/UA4yYEGx",
      "https://www.facebook.com/people/Shadownik(SWNK)/61562599613319",
      "https://instagram.com/Shadownik(SWNK).official",
      "https://www.youtube.com/@Shadownik(SWNK).official",
      "https://t.me/Shadownik(SWNK)official",
      "https://www.whatsapp.com/channel/0029VakSdtTfXUuURqTLgF3A"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91 9165644843",
      "contactType": "customer service",
      "email": "support@swnk.in",
      "availableLanguage": ["English", "Hindi"]
    },
    "slogan": "Transforming Ideas into Digital Reality",
    "description": "Expert web development company specializing in custom solutions that drive business growth and digital transformation.",
    "keywords": "web development, custom websites, e-commerce, web applications, digital transformation, SEO services, mobile apps"
  };

  const professionalServiceData = {
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
    "description": "Shadownik(SWNK) provides premium web development services including custom websites, e-commerce, web applications, and digital marketing solutions. Schedule a free consultation to discuss your project.",
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
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What web development services does Shadownik(SWNK) offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Shadownik(SWNK) offers a comprehensive range of web development services including custom website development, e-commerce solutions, web applications, mobile app development, UI/UX design, and digital marketing services."
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
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(professionalServiceData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqData)}
      </script>
    </>
  );
};

export default SeoSchema; 