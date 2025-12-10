
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import { Loader2 } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;
    
    if (isSignedIn) {
      // Immediately redirect if already signed in
      navigate('/post-auth', { replace: true });
    } else {
      // Show auth modal after a brief delay to prevent flash
      setTimeout(() => {
        setIsLoading(false);
        setOpen(true);
      }, 100);
    }
  }, [isSignedIn, isLoaded, navigate]);

  // Show loading screen while checking auth state
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/30 to-teal-50/40 dark:from-background dark:via-emerald-950/20 dark:to-teal-950/30 flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-600" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
            Loading...
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Please wait while we prepare the authentication.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/30 to-teal-50/40 dark:from-background dark:via-emerald-950/20 dark:to-teal-950/30 flex items-center justify-center p-8">
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default AuthPage;
