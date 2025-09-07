import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';

const DebugPage: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkProfile();
    }
  }, [user]);

  const checkProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      console.log('Profile check result:', { data, error });
      setProfile({ data, error });
    } catch (err) {
      console.error('Error checking profile:', err);
      setProfile({ error: err });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
        
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">User Info</h2>
          <p><strong>Signed In:</strong> {isSignedIn ? 'Yes' : 'No'}</p>
          <p><strong>User ID:</strong> {user?.id || 'None'}</p>
          <p><strong>Email:</strong> {user?.emailAddresses?.[0]?.emailAddress || 'None'}</p>
        </div>

        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">Profile Status</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <p><strong>Profile Exists:</strong> {profile?.data ? 'Yes' : 'No'}</p>
              {profile?.data && (
                <div>
                  <p><strong>Age:</strong> {profile.data.age || 'Not set'}</p>
                  <p><strong>Gender:</strong> {profile.data.gender || 'Not set'}</p>
                  <p><strong>Diet Type:</strong> {profile.data.diet_type || 'Not set'}</p>
                  <p><strong>Created:</strong> {profile.data.created_at}</p>
                </div>
              )}
              {profile?.error && (
                <div className="text-red-600">
                  <p><strong>Error:</strong> {profile.error.message}</p>
                  <p><strong>Code:</strong> {profile.error.code}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Actions</h2>
          <button 
            onClick={checkProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Check Profile
          </button>
          <button 
            onClick={() => window.location.href = '/onboarding'}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Go to Onboarding
          </button>
          <button 
            onClick={() => window.location.href = '/questions'}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Go to Questions
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
