
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

const AuthPage: React.FC = () => {
  const [open, setOpen] = useState(true);
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) navigate('/post-auth', { replace: true });
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/30 to-teal-50/40 dark:from-background dark:via-emerald-950/20 dark:to-teal-950/30 flex items-center justify-center p-8">
      <button onClick={() => setOpen(true)} className="rounded-xl px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
        Open Auth
      </button>
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default AuthPage;
