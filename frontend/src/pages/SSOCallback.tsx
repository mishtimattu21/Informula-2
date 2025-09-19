import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';

const SSOCallback: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  useEffect(() => {
    const handleCallback = async () => {
      if (!signInLoaded || !signUpLoaded) return;

      try {
        // Try to handle the OAuth callback with signIn first
        if (signIn) {
          const result = await signIn.handleRedirectCallback();
          if (result.status === 'complete') {
            navigate('/post-auth', { replace: true });
            return;
          }
        }

        // If signIn doesn't work, try signUp
        if (signUp) {
          const result = await signUp.handleRedirectCallback();
          if (result.status === 'complete') {
            navigate('/post-auth', { replace: true });
            return;
          }
        }

        // If neither works, redirect to auth page
        navigate('/auth', { replace: true });
      } catch (error) {
        console.error('SSO callback error:', error);
        // Redirect to auth page on error
        navigate('/auth', { replace: true });
      }
    };

    handleCallback();
  }, [signInLoaded, signUpLoaded, signIn, signUp, navigate]);

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
