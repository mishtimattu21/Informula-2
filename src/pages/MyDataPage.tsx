import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserButton, useUser } from '@clerk/clerk-react';

const MyDataPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-emerald-600">My Data</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Here you will be able to view and manage your saved data from the Informula database.
        </p>
        <div className="text-gray-400 italic">(This is a placeholder. Integrate your data view here.)</div>
        {isSignedIn && (
          <div className="flex justify-center mt-6">
            <UserButton afterSignOutUrl="/" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDataPage;