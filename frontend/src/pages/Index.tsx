import React from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import StepsSection from '../components/StepsSection';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-svh bg-background dark:bg-background">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <StepsSection />
      <FeaturesSection />
      {/* <ContactSection /> */}
      <Footer />
    </div>
  );
};

export default Index;
