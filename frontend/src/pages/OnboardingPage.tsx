import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

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

  // Initialize profile when component mounts
  useEffect(() => {
    if (user) {
      checkExistingProfile();
    }
  }, [user]);

  const checkExistingProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking existing profile:', error);
        setError('Failed to check existing profile');
        setLoading(false);
        return;
      }

      if (data) {
        // Profile already exists, check if it's complete
        const isComplete = data.age !== null && data.gender !== '' && data.diet_type !== '';
        
        if (isComplete) {
          // Profile is complete, redirect to decode
          toast({ 
            title: 'Profile Found', 
            description: 'You already have a complete profile!', 
            variant: 'default' 
          });
          navigate('/decode');
          return;
        } else {
          // Profile exists but is incomplete, load it for editing
          setProfile({
            id: data.id,
            age: data.age ?? null,
            gender: data.gender ?? '',
            past_medication: Array.isArray(data.past_medication) ? data.past_medication : [],
            allergies: Array.isArray(data.allergies) ? data.allergies : [],
            avoid_list: Array.isArray(data.avoid_list) ? data.avoid_list : [],
            diet_type: data.diet_type ?? ''
          });
          toast({ 
            title: 'Incomplete Profile', 
            description: 'Let\'s complete your profile setup!', 
            variant: 'default' 
          });
        }
      } else {
        // No existing profile, create new one in memory only (don't save yet)
        const defaultProfile: Profile = {
          id: user.id,
          age: null,
          gender: '',
          past_medication: [],
          allergies: [],
          avoid_list: [],
          diet_type: ''
        };
        setProfile(defaultProfile);
      }
    } catch (err) {
      console.error('Unexpected error checking profile:', err);
      setError('An unexpected error occurred');
    }
    
    setLoading(false);
  };

  const saveProfile = async () => {
    if (!profile) {
      setError('No profile to save');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      // Use upsert to handle both insert and update cases
      const { error } = await supabase
        .from('user_profiles')
        .upsert(profile, { 
          onConflict: 'id'
        });
      
      if (error) {
        console.error('Error saving profile:', error);
        setError(`Failed to save profile: ${error.message}`);
        toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
      } else {
        // Mark onboarding as completed for this user
        if (user) {
          localStorage.setItem(`hasCompletedOnboarding_${user.id}`, 'true');
        }
        toast({ title: 'Success', description: 'Your profile has been saved!', variant: 'default' });
        navigate('/');
      }
    } catch (err) {
      console.error('Unexpected error saving profile:', err);
      setError('An unexpected error occurred while saving. Please try again.');
      toast({ title: 'Save failed', description: 'An unexpected error occurred.', variant: 'destructive' });
    }
    
    setSaving(false);
  };


  const isStepComplete = () => {
    if (!profile) return false;
    switch (currentStep) {
      case 1:
        return profile.age !== null && profile.gender !== '' && profile.diet_type !== '';
      case 2:
        return true; // optional
      case 3:
        return true; // optional
      case 4:
        return profile.age !== null && profile.gender !== '' && profile.diet_type !== '';
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/30 to-teal-50/40 dark:from-background dark:via-emerald-950/20 dark:to-teal-950/30 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-600 mb-4">Please sign in first</h1>
          <Button onClick={() => navigate('/auth')}>Go to Sign In</Button>
        </div>
      </div>
    );
  }

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/30 to-teal-50/40 dark:from-background dark:via-emerald-950/20 dark:to-teal-950/30 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-emerald-600 mb-2">Setting up your profile...</h1>
          <p className="text-muted-foreground">Please wait while we prepare your onboarding experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/30 to-teal-50/40 dark:from-background dark:via-emerald-950/20 dark:to-teal-950/30 py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header with progress */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent mb-2">
            Welcome to Informula! 🎉
          </h1>
          <p className="text-lg text-muted-foreground mb-6">Let’s set up your profile</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <br />
              <br />
              <div className="flex gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => navigate('/decode')}
                >
                  Skip to Decode
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Setup Form (Slides) */}
        <div className="space-y-6">
          {/* Slide 1: Basics */}
          {currentStep === 1 && (
            <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-background p-8">
              <h2 className="text-2xl font-semibold mb-8 text-center">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground/70 block">Age</label>
                  <Input type="number" placeholder="Enter your age" value={profile?.age === null ? '' : String(profile?.age)} onChange={(e) => setProfile(p => p ? { ...p, age: e.target.value === '' ? null : Number(e.target.value) } : p)} className="h-12 text-center text-lg" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground/70 block">Gender</label>
                  <select className="w-full h-12 rounded-md border px-4 py-3 bg-background text-lg" value={profile?.gender || ''} onChange={(e) => setProfile(p => p ? { ...p, gender: e.target.value } : p)}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground/70 block">Diet Type</label>
                  <select className="w-full h-12 rounded-md border px-4 py-3 bg-background text-lg" value={profile?.diet_type || ''} onChange={(e) => setProfile(p => p ? { ...p, diet_type: e.target.value } : p)}>
                    <option value="">Select Diet</option>
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-veg">Non-vegetarian</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Slide 2: Medications */}
          {currentStep === 2 && (
            <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-background p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Past Medications</h2>
              <p className="text-muted-foreground text-center mb-6">Add medications you've taken in the past (optional)</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile?.past_medication.map((m, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm flex items-center gap-2">{m}
                    <button className="hover:text-emerald-900" onClick={() => setProfile(p => p ? { ...p, past_medication: p.past_medication.filter((_, idx) => idx !== i) } : p)}>×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <Input placeholder="Add medication and press Enter" value={newMed} onChange={(e) => setNewMed(e.target.value)} onKeyDown={(e) => {
                  if (e.key === 'Enter' && newMed.trim() && profile) {
                    setProfile({ ...profile, past_medication: [...profile.past_medication, newMed.trim()] });
                    setNewMed('');
                  }
                }} />
                <Button variant="outline" onClick={() => { if (newMed.trim() && profile) { setProfile({ ...profile, past_medication: [...profile.past_medication, newMed.trim()] }); setNewMed(''); } }}>Add</Button>
              </div>
            </div>
          )}

          {/* Slide 3: Allergies & Avoid List */}
          {currentStep === 3 && (
            <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-background p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-center">Allergies</h2>
                <p className="text-sm text-muted-foreground mb-4 text-center">Select common allergies or add your own</p>
                
                {/* Common Indian Allergies */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-foreground/70 mb-3">Common Allergies in India:</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Peanuts', 'Cashews', 'Almonds', 'Milk', 'Eggs', 'Fish', 'Shellfish', 'Sesame'].map((allergy) => (
                      <button
                        key={allergy}
                        onClick={() => {
                          if (profile && !profile.allergies.includes(allergy)) {
                            setProfile({ ...profile, allergies: [...profile.allergies, allergy] });
                          }
                        }}
                        className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                          profile?.allergies.includes(allergy)
                            ? 'bg-rose-100 text-rose-700 border-rose-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                        disabled={profile?.allergies.includes(allergy)}
                      >
                        {allergy}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Allergies */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-foreground/70 mb-3">Your Allergies:</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile?.allergies.map((m, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm flex items-center gap-2">{m}
                        <button className="hover:text-rose-900" onClick={() => setProfile(p => p ? { ...p, allergies: p.allergies.filter((_, idx) => idx !== i) } : p)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Custom Allergy Input */}
                <div className="flex gap-2">
                  <Input placeholder="Add custom allergy and press Enter" value={newAllergy} onChange={(e) => setNewAllergy(e.target.value)} onKeyDown={(e) => {
                    if (e.key === 'Enter' && newAllergy.trim() && profile && !profile.allergies.includes(newAllergy.trim())) {
                      setProfile({ ...profile, allergies: [...profile.allergies, newAllergy.trim()] });
                      setNewAllergy('');
                    }
                  }} />
                  <Button variant="outline" onClick={() => { if (newAllergy.trim() && profile && !profile.allergies.includes(newAllergy.trim())) { setProfile({ ...profile, allergies: [...profile.allergies, newAllergy.trim()] }); setNewAllergy(''); } }}>Add</Button>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-center">Items to Avoid</h2>
                <p className="text-sm text-muted-foreground mb-4 text-center">Select common ingredients to avoid or add your own</p>
                
                {/* Common Items to Avoid */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-foreground/70 mb-3">Common Items to Avoid:</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Artificial Colors', 'Preservatives', 'High Sodium', 'Artificial Sweeteners', 'Ajinomoto'].map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          if (profile && !profile.avoid_list.includes(item)) {
                            setProfile({ ...profile, avoid_list: [...profile.avoid_list, item] });
                          }
                        }}
                        className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                          profile?.avoid_list.includes(item)
                            ? 'bg-amber-100 text-amber-700 border-amber-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                        disabled={profile?.avoid_list.includes(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Items to Avoid */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-foreground/70 mb-3">Your Avoid List:</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile?.avoid_list.map((m, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm flex items-center gap-2">{m}
                        <button className="hover:text-amber-900" onClick={() => setProfile(p => p ? { ...p, avoid_list: p.avoid_list.filter((_, idx) => idx !== i) } : p)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Custom Input */}
                <div className="flex gap-2">
                  <Input placeholder="Add custom item and press Enter" value={newAvoid} onChange={(e) => setNewAvoid(e.target.value)} onKeyDown={(e) => {
                    if (e.key === 'Enter' && newAvoid.trim() && profile && !profile.avoid_list.includes(newAvoid.trim())) {
                      setProfile({ ...profile, avoid_list: [...profile.avoid_list, newAvoid.trim()] });
                      setNewAvoid('');
                    }
                  }} />
                  <Button variant="outline" onClick={() => { if (newAvoid.trim() && profile && !profile.avoid_list.includes(newAvoid.trim())) { setProfile({ ...profile, avoid_list: [...profile.avoid_list, newAvoid.trim()] }); setNewAvoid(''); } }}>Add</Button>
                </div>
              </div>
            </div>
          )}

          {/* Slide 4: Review */}
          {currentStep === 4 && (
            <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-background p-8 space-y-6">
              <h2 className="text-2xl font-semibold text-center mb-4">Review & Confirm</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Age</div>
                  <div className="text-lg font-medium">{profile?.age ?? '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Gender</div>
                  <div className="text-lg font-medium">{profile?.gender || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Diet Type</div>
                  <div className="text-lg font-medium">{profile?.diet_type || '—'}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Past Medications</div>
                <div className="flex flex-wrap gap-2">{profile?.past_medication.length ? profile.past_medication.map((m,i)=> (
                  <span key={i} className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">{m}</span>
                )) : <span className="text-muted-foreground">None</span>}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Allergies</div>
                <div className="flex flex-wrap gap-2">{profile?.allergies.length ? profile.allergies.map((m,i)=> (
                  <span key={i} className="px-2 py-1 rounded-full bg-rose-100 text-rose-700 text-xs">{m}</span>
                )) : <span className="text-muted-foreground">None</span>}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Avoid List</div>
                <div className="flex flex-wrap gap-2">{profile?.avoid_list.length ? profile.avoid_list.map((m,i)=> (
                  <span key={i} className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">{m}</span>
                )) : <span className="text-muted-foreground">None</span>}</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <div className="flex gap-2">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>Previous</Button>
          </div>
          <div className="flex gap-3">
            {currentStep < totalSteps ? (
              <Button onClick={nextStep} disabled={!isStepComplete()} className="flex items-center gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={saveProfile} disabled={saving || !profile || !isStepComplete()} className="flex items-center gap-2">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/decode')}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
