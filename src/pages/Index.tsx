import React from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import StepsSection from '../components/StepsSection';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/30 to-teal-50/40 dark:from-background dark:via-emerald-950/20 dark:to-teal-950/30">
        <Navigation />
        <HeroSection />
        <AboutSection />
        <StepsSection />
        <FeaturesSection />
        {/* <ContactSection /> */}
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
