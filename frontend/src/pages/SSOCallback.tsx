import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';

const SSOCallback: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    const handleCallback = async () => {
      if (!isLoaded) return;

      try {
        // Handle the OAuth callback
        const result = await handleRedirectCallback();
        console.log('OAuth callback result:', result);
        console.log('Authentication state after callback:', { isSignedIn, isLoaded });
        
        if (result?.status === 'complete') {
          // Authentication successful, redirect to landing page
          console.log('Authentication complete, redirecting to landing page');
          navigate('/', { replace: true });
        } else {
          // Authentication failed or incomplete, redirect to landing page
          console.log('Authentication incomplete, redirecting to landing page');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [isLoaded, navigate, handleRedirectCallback]);

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
