import React from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import StepsSection from '../components/StepsSection';
import FeaturesSection from '../components/FeaturesSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Navigation />
        <HeroSection />
        <AboutSection />
        <StepsSection />
        <FeaturesSection />
        <ContactSection />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
