import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import StepsSection from '../components/StepsSection';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';

const Index = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  // Remove the automatic profile check from Index page
  // Users can now visit the landing page without being forced to onboarding

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
