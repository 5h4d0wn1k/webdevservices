import React from 'react';
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

function App() {
  // Simple client-side routing
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname);

  React.useEffect(() => {
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
        return <PrivacyPolicy />;
      case '/terms-of-service':
        return <TermsOfService />;
      default:
        return (
          <>
            <Navigation />
            <main>
              <Hero />
              <FeaturedProjects />
              <Services />
              <About />
              <Portfolio />
              <Blog />
              <Contact />
            </main>
            <Footer />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {renderContent()}
    </div>
  );
}

export default App;