import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';

const SSOCallback: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      if (!isLoaded) return;

      // Wait a bit for Clerk to process the OAuth callback
      setTimeout(() => {
        if (isSignedIn) {
          // User is signed in, redirect to post-auth
          navigate('/post-auth', { replace: true });
        } else {
          // User is not signed in, redirect to auth page
          navigate('/auth', { replace: true });
        }
      }, 1000);
    };

    handleCallback();
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/30 to-teal-50/40 dark:from-background dark:via-emerald-950/20 dark:to-teal-950/30 flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-600" />
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Completing sign in...
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Please wait while we finish setting up your account.
        </p>
      </div>
    </div>
  );
};

export default SSOCallback;
