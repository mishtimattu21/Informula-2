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

      // Check if profile exists
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, age, gender, diet_type')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        // If we can't read the row (e.g. RLS), send to onboarding to let user create it
        navigate('/onboarding', { replace: true });
        return;
      }

      if (!data) {
        // No profile yet → create a default row immediately, then send to onboarding
        const defaultProfile = {
          id: user.id,
          age: null as number | null,
          gender: '',
          diet_type: '',
          past_medication: [] as string[],
          allergies: [] as string[],
          avoid_list: [] as string[]
        };

        const { error: insertErr } = await supabase
          .from('user_profiles')
          .insert(defaultProfile);

        // Even if insertion fails (e.g. RLS), continue to onboarding where upsert will run
        navigate('/onboarding', { replace: true });
        return;
      }

      const isComplete = data.age !== null && data.gender && data.diet_type;
      navigate(isComplete ? '/' : '/onboarding', { replace: true });
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


