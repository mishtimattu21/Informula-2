
import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/30 to-teal-50/40 dark:from-background dark:via-emerald-950/20 dark:to-teal-950/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent mb-8 mt-2 text-center">
          Informula
        </div>
        <div className="w-full flex flex-col items-center">
          {isLogin ? (
            <SignIn routing="hash" afterSignInUrl="/questions" />
          ) : (
            <SignUp routing="hash" afterSignUpUrl="/questions" />
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
