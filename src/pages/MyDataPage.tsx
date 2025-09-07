import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserButton, useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const MyDataPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  type Profile = {
    id: string;
    age: number | null;
    gender: string;
    past_medication: string[];
    allergies: string[];
    avoid_list: string[];
    diet_type: string;
  };

  const [profile, setProfile] = useState<Profile | null>(null);
  const [newMed, setNewMed] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newAvoid, setNewAvoid] = useState('');

  const fetchOrCreateProfile = async () => {
    if (!user) {
      setError('Please sign in to access your profile');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id') || supabaseKey.includes('your-anon-key')) {
        setError('Supabase is not configured. Please set up your environment variables.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        setError(`Failed to load profile: ${error.message}`);
        setLoading(false);
        return;
      }
      
      if (!data) {
        // No profile exists, redirect to onboarding
        setError('No profile found. Please complete your profile setup first.');
        setTimeout(() => {
          window.location.href = '/onboarding';
        }, 2000);
        setLoading(false);
        return;
      } else {
        // Load existing profile
        setProfile({
          id: data.id,
          age: data.age ?? null,
          gender: data.gender ?? '',
          past_medication: Array.isArray(data.past_medication) ? data.past_medication : [],
          allergies: Array.isArray(data.allergies) ? data.allergies : [],
          avoid_list: Array.isArray(data.avoid_list) ? data.avoid_list : [],
          diet_type: data.diet_type ?? ''
        });
        setSuccess('Profile loaded successfully!');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  const saveProfile = async (next?: Partial<Profile>) => {
    if (!profile) {
      setError('No profile to save');
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const toSave = { ...profile, ...(next || {}) } as Profile;
      const { error } = await supabase.from('user_profiles').upsert(toSave, { onConflict: 'id' });
      
      if (error) {
        console.error('Error saving profile:', error);
        setError(`Failed to save profile: ${error.message}`);
        toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
      } else {
        setProfile(toSave);
        setSuccess('Profile saved successfully!');
        toast({ title: 'Success', description: 'Your profile has been updated.', variant: 'default' });
      }
    } catch (err) {
      console.error('Unexpected error saving profile:', err);
      setError('An unexpected error occurred while saving. Please try again.');
      toast({ title: 'Save failed', description: 'An unexpected error occurred.', variant: 'destructive' });
    }
    
    setSaving(false);
  };

  useEffect(() => { fetchOrCreateProfile(); }, [user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/30 to-teal-50/40 dark:from-background dark:via-emerald-950/20 dark:to-teal-950/30 pt-8 pb-16">
      {/* Global top bar with back button aligned left */}
      <div className="container mx-auto px-4 py-2">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
        >
          Back to home
        </button>
      </div>

      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">My Profile</h1>
          {isSignedIn && <UserButton afterSignOutUrl="/" />}
        </div>

        <div className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <br />
                <br />
                <strong>Setup Instructions:</strong>
                <br />
                1. Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard</a>
                <br />
                2. Create a new project
                <br />
                3. Go to Settings → API and copy your Project URL and anon key
                <br />
                4. Update your <code>.env</code> file with the real values
                <br />
                5. Run the SQL from <code>database_setup.sql</code> in Supabase SQL Editor
                <br />
                6. Restart your development server
              </AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Loading your profile...
              </AlertDescription>
            </Alert>
          )}

          {/* Basics */}
          <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-background p-5">
            <h2 className="font-semibold mb-4">Basics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-foreground/70">Age</label>
                <Input
                  type="number"
                  value={profile?.age === null ? '' : String(profile?.age)}
                  onChange={(e) => setProfile(p => p ? { ...p, age: e.target.value === '' ? null : Number(e.target.value) } : p)}
                />
              </div>
              <div>
                <label className="text-sm text-foreground/70">Gender</label>
                <select
                  className="w-full rounded-md border px-3 py-2 bg-background"
                  value={profile?.gender || ''}
                  onChange={(e) => setProfile(p => p ? { ...p, gender: e.target.value } : p)}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-foreground/70">Diet Type</label>
                <select
                  className="w-full rounded-md border px-3 py-2 bg-background"
                  value={profile?.diet_type || ''}
                  onChange={(e) => setProfile(p => p ? { ...p, diet_type: e.target.value } : p)}
                >
                  <option value="">Select</option>
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-veg">Non‑veg</option>
                </select>
              </div>
            </div>
          </div>

          {/* Chips Editors */}
          <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-background p-5">
            <h2 className="font-semibold mb-4">Health Preferences</h2>
            <div className="space-y-5">
              <div>
                <label className="text-sm text-foreground/70">Past Medications</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile?.past_medication.map((m, i) => (
                    <span key={i} className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">{m}
                      <button className="ml-2" onClick={() => setProfile(p => p ? { ...p, past_medication: p.past_medication.filter((_, idx) => idx !== i) } : p)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input placeholder="Add medication and press Enter" value={newMed} onChange={(e) => setNewMed(e.target.value)} onKeyDown={(e) => {
                    if (e.key === 'Enter' && newMed.trim() && profile) {
                      setProfile({ ...profile, past_medication: [...profile.past_medication, newMed.trim()] });
                      setNewMed('');
                    }
                  }} />
                  <Button variant="outline" onClick={() => { if (newMed.trim() && profile) { setProfile({ ...profile, past_medication: [...profile.past_medication, newMed.trim()] }); setNewMed(''); } }}>Add</Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-foreground/70">Allergies</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile?.allergies.map((m, i) => (
                    <span key={i} className="px-2 py-1 rounded-full bg-rose-100 text-rose-700 text-xs">{m}
                      <button className="ml-2" onClick={() => setProfile(p => p ? { ...p, allergies: p.allergies.filter((_, idx) => idx !== i) } : p)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input placeholder="Add allergy and press Enter" value={newAllergy} onChange={(e) => setNewAllergy(e.target.value)} onKeyDown={(e) => {
                    if (e.key === 'Enter' && newAllergy.trim() && profile) {
                      setProfile({ ...profile, allergies: [...profile.allergies, newAllergy.trim()] });
                      setNewAllergy('');
                    }
                  }} />
                  <Button variant="outline" onClick={() => { if (newAllergy.trim() && profile) { setProfile({ ...profile, allergies: [...profile.allergies, newAllergy.trim()] }); setNewAllergy(''); } }}>Add</Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-foreground/70">Avoid List</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile?.avoid_list.map((m, i) => (
                    <span key={i} className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">{m}
                      <button className="ml-2" onClick={() => setProfile(p => p ? { ...p, avoid_list: p.avoid_list.filter((_, idx) => idx !== i) } : p)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input placeholder="Add item and press Enter" value={newAvoid} onChange={(e) => setNewAvoid(e.target.value)} onKeyDown={(e) => {
                    if (e.key === 'Enter' && newAvoid.trim() && profile) {
                      setProfile({ ...profile, avoid_list: [...profile.avoid_list, newAvoid.trim()] });
                      setNewAvoid('');
                    }
                  }} />
                  <Button variant="outline" onClick={() => { if (newAvoid.trim() && profile) { setProfile({ ...profile, avoid_list: [...profile.avoid_list, newAvoid.trim()] }); setNewAvoid(''); } }}>Add</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => fetchOrCreateProfile()} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh'}</Button>
            <Button onClick={() => saveProfile()} disabled={saving || !profile}>{saving ? 'Saving…' : 'Save Profile'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDataPage;