import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import FeaturedProjects from './components/FeaturedProjects';
import Services from './components/Services';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import SeoSchema from './components/SeoSchema';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import CookieConsent from './components/CookieConsent';
import ChatBot from './components/ChatBot';
import ConsultationBooking from './components/ConsultationBooking';
import { ScrollExperience } from './components/services/ScrollExperience';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClientOnboarding } from './components/services/ClientOnboarding';
import Admin from './pages/Admin';

function App() {
  // Simple client-side routing
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  // Render different pages based on the current path
  const renderContent = () => {
    switch (currentPath) {
      case '/privacy-policy':
        return (
          <>
            <Navigation />
            <PrivacyPolicy />
            <Footer />
          </>
        );
      case '/terms-of-service':
        return (
          <>
            <Navigation />
            <TermsOfService />
            <Footer />
          </>
        );
      case '/services':
        return (
          <>
            <Navigation />
            <ScrollExperience />
            <ConsultationBooking />
            <Newsletter />
            <Footer />
          </>
        );
      default:
        return (
          <>
            <Navigation />
            <main>
              <Hero />
              <FeaturedProjects />
              <Services />
              <ConsultationBooking />
              <Testimonials />
              <About />
              <Portfolio />
              <Blog />
              <Newsletter />
              <Contact />
            </main>
            <Footer />
          </>
        );
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <SeoSchema />
        <PageTransition>
          <Routes>
            <Route path="/" element={renderContent()} />
            <Route path="/onboarding" element={<ClientOnboarding />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <ScrollToTop />
          <ChatBot />
          <CookieConsent />
        </PageTransition>
      </div>
    </Router>
  );
}

export default App;