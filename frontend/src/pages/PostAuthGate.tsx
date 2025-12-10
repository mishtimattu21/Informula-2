import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

const PostAuthGate: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const go = async () => {
      if (!isSignedIn || !user) return;

      try {
        // Check if profile exists with a timeout
        const profilePromise = supabase
          .from('user_profiles')
          .select('id, age, gender, diet_type')
          .eq('id', user.id)
          .maybeSingle();

        // Race between profile check and timeout (reduced to 1.5s for faster response)
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
        navigate(isComplete ? '/' : '/onboarding', { replace: true });
      } catch (error) {
        // On any error, send to onboarding
        navigate('/onboarding', { replace: true });
      }
    };
    go();
  }, [isSignedIn, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/30 to-teal-50/40 dark:from-background dark:via-emerald-950/20 dark:to-teal-950/30 flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-emerald-600 mb-2">Preparing your experience…</h1>
        <p className="text-muted-foreground">One moment while we route you to the right place</p>
      </div>
    </div>
  );
};

export default PostAuthGate;


