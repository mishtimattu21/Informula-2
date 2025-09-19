import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const Main = () => (
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={clerkPubKey}
      fallbackRedirectUrl={`${window.location.origin}/post-auth`}
      signInUrl={`${window.location.origin}/auth`}
      signUpUrl={`${window.location.origin}/auth`}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')!).render(<Main />);
