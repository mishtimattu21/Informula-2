import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';

const BYPASS_PATHS = new Set<string>([
  '/post-auth',
  '/onboarding',
  '/sso-callback',
]);

const FirstLoginGuard: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const run = async () => {
      if (!isSignedIn || !user) return;

      // Don't guard onboarding/auth routes
      if (BYPASS_PATHS.has(location.pathname)) return;

      // Only run once per session to avoid extra calls
      if (sessionStorage.getItem('profileGuardChecked') === 'true') return;

      try {
        // Add timeout to prevent hanging
        const profilePromise = supabase
          .from('user_profiles')
          .select('id, age, gender, diet_type')
          .eq('id', user.id)
          .maybeSingle();

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile check timeout')), 1500)
        );

        const { data } = await Promise.race([profilePromise, timeoutPromise]) as any;

        const incomplete = !data || data.age === null || !data.gender || !data.diet_type;
        if (incomplete) {
          navigate('/onboarding', { replace: true });
        }

        sessionStorage.setItem('profileGuardChecked', 'true');
      } catch (error) {
        // On timeout or error, assume incomplete and send to onboarding
        navigate('/onboarding', { replace: true });
        sessionStorage.setItem('profileGuardChecked', 'true');
      }
    };
    run();
  }, [isSignedIn, user, navigate, location.pathname]);

  return null;
};

export default FirstLoginGuard;


