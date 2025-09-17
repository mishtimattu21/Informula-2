import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { dark, neobrutalism } from '@clerk/themes';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const appearance = {
    // Apply strong theme overrides; avoid defaults leaking through
    baseTheme: [dark, neobrutalism],
    layout: {
      socialButtonsVariant: 'blockButton',
      socialButtonsPlacement: 'top',
    },
    variables: {
      colorPrimary: '#10b981', // emerald-500
      colorPrimaryHover: '#059669',
      colorText: '#0f172a',
      colorTextOnPrimaryBackground: '#ffffff',
      colorInputBackground: '#ffffff',
      colorBackground: 'transparent',
      borderRadius: '16px',
      fontSize: '14px',
    },
    elements: {
      rootBox: 'w-full',
      card: 'w-[440px] max-w-full bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(16,185,129,0.35)] border-2 border-emerald-200/70 dark:border-emerald-900 rounded-2xl',
      header: 'pt-6',
      headerTitle: 'bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent font-extrabold text-center text-2xl',
      headerSubtitle: 'text-slate-600 dark:text-slate-400 text-center',
      formButtonPrimary: 'rounded-xl h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20',
      formFieldLabel: 'text-slate-600 dark:text-slate-300',
      formFieldInput: 'rounded-xl h-11 border-2 border-slate-200 focus:border-emerald-500 focus:ring-0 dark:border-slate-700 dark:focus:border-emerald-500',
      formFieldInputShowPasswordButton: 'text-emerald-600 hover:text-emerald-700',
      socialButtonsBlockButton: 'rounded-xl h-11 border-2 border-emerald-200/70 hover:border-emerald-400/90 text-slate-800 dark:text-slate-200 bg-white dark:bg-transparent',
      socialButtonsBlockButtonText: 'font-medium',
      dividerLine: 'bg-emerald-100 dark:bg-emerald-900',
      dividerText: 'text-slate-400',
      footerActionLink: 'text-emerald-600 hover:text-emerald-700 font-medium',
      identityPreviewEditButton: 'text-emerald-600 hover:text-emerald-700',
      alert: 'rounded-xl',
      footer: 'hidden', // visually hide dev footer to keep card clean
      badge: 'hidden'
    }
  } as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/30 to-teal-50/40 dark:from-background dark:via-emerald-950/20 dark:to-teal-950/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent mb-8 mt-2 text-center">
          Informula
        </div>
        <div className="w-full flex flex-col items-center">
          {isLogin ? (
            <SignIn
              routing="hash"
              appearance={appearance}
              signUpUrl="#/auth?screen=sign-up"
            />
          ) : (
            <SignUp
              routing="hash"
              appearance={appearance}
              signInUrl="#/auth?screen=sign-in"
            />
          )}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium transition-colors text-center"
          >
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;


