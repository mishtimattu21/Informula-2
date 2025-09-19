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

  useEffect(() => {
    const checkProfile = async () => {
      if (!isSignedIn || !user) return;

      try {
        // Check if profile exists with a timeout
        const profilePromise = supabase
          .from('user_profiles')
          .select('id, age, gender, diet_type')
          .eq('id', user.id)
          .maybeSingle();

        // Race between profile check and timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile check timeout')), 1500)
        );

        const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

        if (error || !data) {
          // If we can't read the row or no data, send to onboarding
          navigate('/onboarding', { replace: true });
          return;
        }

        const isComplete = data.age !== null && data.gender && data.diet_type;
        if (!isComplete) {
          // Profile incomplete, send to onboarding
          navigate('/onboarding', { replace: true });
        }
        // If profile is complete, stay on landing page
      } catch (error) {
        // On any error, send to onboarding
        navigate('/onboarding', { replace: true });
      }
    };

    checkProfile();
  }, [isSignedIn, user, navigate]);

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
