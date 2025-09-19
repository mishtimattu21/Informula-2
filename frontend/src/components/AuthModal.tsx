import React, { useEffect, useState } from 'react';
import { useSignIn, useSignUp, useAuth, useClerk } from '@clerk/clerk-react';

const GOOGLE_LOGO_URL = 'https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_48dp.png';

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { isSignedIn } = useAuth();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { setActive } = useClerk();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn && open) {
      // Immediately close modal when signed in
      onClose();
    }
  }, [isSignedIn, open, onClose]);

  if (!open) return null;

  const startGoogle = async () => {
    if (!signInLoaded) return;
    setLoading(true);
    try {
      await signIn!.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/`
      });
    } catch (e: any) {
      setError(e.errors?.[0]?.message || 'Google sign-in failed');
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInLoaded) return;
    setLoading(true); setError(null);
    try {
      const result = await signIn!.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        onClose();
      } else {
        setError('Additional steps required.');
      }
    } catch (e: any) {
      setError(e.errors?.[0]?.longMessage || e.errors?.[0]?.message || 'Sign in failed');
    } finally { setLoading(false); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpLoaded) return;
    setLoading(true); setError(null);
    try {
      await signUp!.create({ emailAddress: email, password, firstName });
      await signUp!.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (e: any) {
      setError(e.errors?.[0]?.longMessage || e.errors?.[0]?.message || 'Sign up failed');
    } finally { setLoading(false); }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpLoaded) return;
    setLoading(true); setError(null);
    try {
      const complete = await signUp!.attemptEmailAddressVerification({ code });
      if (complete.status === 'complete') {
        await setActive({ session: complete.createdSessionId });
        onClose();
      }
    } catch (e: any) {
      setError(e.errors?.[0]?.message || 'Verification failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="w-full bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl border-2 border-emerald-100 dark:border-emerald-900 rounded-2xl shadow-[0_10px_40px_-10px_rgba(16,185,129,0.35)] p-6">
          <div className="flex items-center justify-end mb-2">
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
          </div>
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-xl overflow-hidden border-2 border-emerald-200">
              <button className={`px-4 py-2 text-sm font-medium ${isLogin ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'bg-white dark:bg-zinc-900 text-emerald-700'}`} onClick={() => { setIsLogin(true); setPendingVerification(false); setError(null); }}>Sign In</button>
              <button className={`px-4 py-2 text-sm font-medium ${!isLogin ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'bg-white dark:bg-zinc-900 text-emerald-700'}`} onClick={() => { setIsLogin(false); setPendingVerification(false); setError(null); }}>Sign Up</button>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</div>
          )}

          {isLogin ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <button type="button" onClick={startGoogle} disabled={loading} className="w-full h-11 rounded-xl border-2 border-emerald-200 hover:border-emerald-400 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 disabled:opacity-50">
                <img src={GOOGLE_LOGO_URL} alt="Google" className="h-5 w-5"/>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </button>
              <div className="flex items-center gap-3"><div className="flex-1 h-px bg-emerald-100 dark:bg-emerald-900"></div><span className="text-xs text-slate-400">or</span><div className="flex-1 h-px bg-emerald-100 dark:bg-emerald-900"></div></div>
              <div>
                <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">Email address</label>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required className="w-full h-11 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 bg-white dark:bg-zinc-900 px-3 outline-none" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">Password</label>
                <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required className="w-full h-11 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 bg-white dark:bg-zinc-900 px-3 outline-none" />
              </div>
              <button disabled={loading} className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          ) : (
            pendingVerification ? (
              <form onSubmit={handleVerify} className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">We sent a 6‑digit code to <span className="font-medium">{email}</span></p>
                <div>
                  <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">Verification code</label>
                  <input value={code} onChange={(e)=>setCode(e.target.value)} inputMode="numeric" pattern="[0-9]*" required className="w-full h-11 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 bg-white dark:bg-zinc-900 px-3 outline-none" />
                </div>
                <button disabled={loading} className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                  {loading ? 'Verifying…' : 'Verify & Continue'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <button type="button" onClick={startGoogle} disabled={loading} className="w-full h-11 rounded-xl border-2 border-emerald-200 hover:border-emerald-400 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 disabled:opacity-50">
                  <img src={GOOGLE_LOGO_URL} alt="Google" className="h-5 w-5"/>
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </button>
                <div className="flex items-center gap-3"><div className="flex-1 h-px bg-emerald-100 dark:bg-emerald-900"></div><span className="text-xs text-slate-400">or</span><div className="flex-1 h-px bg-emerald-100 dark:bg-emerald-900"></div></div>
                <div>
                  <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">First name</label>
                  <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} type="text" required className="w-full h-11 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 bg-white dark:bg-zinc-900 px-3 outline-none" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">Email address</label>
                  <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required className="w-full h-11 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 bg-white dark:bg-zinc-900 px-3 outline-none" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">Password</label>
                  <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required className="w-full h-11 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-emerald-500 bg-white dark:bg-zinc-900 px-3 outline-none" />
                </div>
                <button disabled={loading} className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;


