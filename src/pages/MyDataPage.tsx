import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserButton, useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

const MyDataPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  type Profile = {
    id: string;
    age: number | '';
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
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
    if (error && error.code !== 'PGRST116') {
      setLoading(false);
      return;
    }
    if (!data) {
      const defaultProfile: Profile = {
        id: user.id,
        age: '' as const,
        gender: '',
        past_medication: [],
        allergies: [],
        avoid_list: [],
        diet_type: ''
      };
      const { error: upErr } = await supabase.from('user_profiles').insert(defaultProfile);
      if (!upErr) setProfile(defaultProfile);
      setLoading(false);
      return;
    }
    setProfile({
      id: data.id,
      age: data.age ?? '',
      gender: data.gender ?? '',
      past_medication: Array.isArray(data.past_medication) ? data.past_medication : [],
      allergies: Array.isArray(data.allergies) ? data.allergies : [],
      avoid_list: Array.isArray(data.avoid_list) ? data.avoid_list : [],
      diet_type: data.diet_type ?? ''
    });
    setLoading(false);
  };

  const saveProfile = async (next?: Partial<Profile>) => {
    if (!profile) return;
    const toSave = { ...profile, ...(next || {}) } as Profile;
    setSaving(true);
    const { error } = await supabase.from('user_profiles').upsert(toSave, { onConflict: 'id' });
    setSaving(false);
    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      setProfile(toSave);
      toast({ title: 'Saved', description: 'Your profile has been updated.' });
    }
  };

  useEffect(() => { fetchOrCreateProfile(); }, [user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/30 to-teal-50/40 dark:from-background dark:via-emerald-950/20 dark:to-teal-950/30 py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">My Profile</h1>
          {isSignedIn && <UserButton afterSignOutUrl="/" />}
        </div>

        <div className="space-y-6">
          {/* Basics */}
          <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-background p-5">
            <h2 className="font-semibold mb-4">Basics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-foreground/70">Age</label>
                <Input
                  type="number"
                  value={profile?.age === '' ? '' : String(profile?.age)}
                  onChange={(e) => setProfile(p => p ? { ...p, age: e.target.value === '' ? '' : Number(e.target.value) } : p)}
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