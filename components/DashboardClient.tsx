'use client';

import { useState } from 'react';
import { getSupabaseBrowserClient, normalizePhone, storagePath } from '@/lib/supabase';
import { ALL_DISTRICTS, EQUIPMENT_OPTIONS, type Surveyor } from '@/types/surveyor';

export function DashboardClient() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState<Surveyor | null>(null);
  const supabase = getSupabaseBrowserClient();

  async function sendOtp() {
    if (!supabase) {
      setMessage('Add Supabase credentials to enable OTP login.');
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({ phone: `+${normalizePhone(phone)}` });
    setMessage(error ? error.message : 'OTP sent. Check your SMS.');
  }

  async function verifyOtp() {
    if (!supabase) return;
    const normalized = normalizePhone(phone);
    const { error } = await supabase.auth.verifyOtp({ phone: `+${normalized}`, token: otp, type: 'sms' });
    if (error) {
      setMessage(error.message);
      return;
    }
    const { data, error: profileError } = await supabase.from('surveyors').select('*').eq('phone', normalized).single();
    setProfile(data ?? null);
    setMessage(profileError ? profileError.message : '');
  }

  async function saveProfile(formData: FormData) {
    if (!supabase || !profile) return;
    let profilePhotoUrl = profile.profile_photo_url;
    let licenseDocUrl = profile.license_doc_url;
    const profilePhoto = formData.get('profile_photo') as File | null;
    const licenseDoc = formData.get('license_doc') as File | null;

    if (profilePhoto && profilePhoto.size > 0) {
      const path = storagePath(profile.phone, profilePhoto.name);
      const { error } = await supabase.storage.from('profile-photos').upload(path, profilePhoto, { upsert: true });
      if (error) {
        setMessage(error.message);
        return;
      }
      profilePhotoUrl = supabase.storage.from('profile-photos').getPublicUrl(path).data.publicUrl;
    }

    if (licenseDoc && licenseDoc.size > 0) {
      const path = storagePath(profile.phone, licenseDoc.name);
      const { error } = await supabase.storage.from('license-docs').upload(path, licenseDoc, { upsert: true });
      if (error) {
        setMessage(error.message);
        return;
      }
      licenseDocUrl = path;
    }

    const updates = {
      full_name: String(formData.get('full_name') ?? ''),
      whatsapp: normalizePhone(String(formData.get('whatsapp') ?? '')),
      license_number: String(formData.get('license_number') ?? ''),
      years_experience: Number(formData.get('years_experience') ?? 0),
      equipment: formData.getAll('equipment').map(String),
      districts_served: formData.getAll('districts_served').map(String).slice(0, 5),
      bio: String(formData.get('bio') ?? ''),
      profile_photo_url: profilePhotoUrl,
      license_doc_url: licenseDocUrl,
      available: formData.get('available') === 'yes',
    };
    const { data, error } = await supabase.from('surveyors').update(updates).eq('id', profile.id).select('*').single();
    if (error) setMessage(error.message);
    else {
      setProfile(data);
      setMessage('Profile saved.');
    }
  }

  async function deleteAccount() {
    if (!supabase || !profile || !confirm('Are you sure? This cannot be undone.')) return;
    const { error } = await supabase.from('surveyors').delete().eq('id', profile.id);
    if (error) setMessage(error.message);
    else {
      setProfile(null);
      setMessage('Account deleted.');
    }
  }

  if (!profile) {
    return (
      <section className="mx-auto max-w-xl rounded-lg border border-border bg-white p-6">
        <h1 className="text-3xl font-bold">Surveyor Login</h1>
        <p className="mt-2 text-text-secondary">Enter your registered phone number to receive an OTP.</p>
        <div className="mt-6 grid gap-4">
          <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" className="rounded-md border border-border px-4 py-3" />
          <button type="button" onClick={sendOtp} className="rounded-md bg-primary px-5 py-3 font-bold text-white">
            Send OTP
          </button>
          <input value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="Enter OTP" className="rounded-md border border-border px-4 py-3" />
          <button type="button" onClick={verifyOtp} className="rounded-md border border-border px-5 py-3 font-bold">
            Verify & Login
          </button>
          {message && <p className="rounded-md bg-bg p-3 text-sm text-text-secondary">{message}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl rounded-lg border border-border bg-white p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          {profile.status === 'pending' && <p className="mt-2 rounded-md bg-primary-light p-3 text-sm text-primary-dark">Your profile is under review. You will appear in search once approved.</p>}
        </div>
        <a href={`/surveyor/${profile.id}`} className="rounded-md border border-border px-4 py-3 text-center font-bold">
          View Public Profile
        </a>
      </div>
      <form action={saveProfile} className="mt-6 grid gap-4">
        <input name="full_name" defaultValue={profile.full_name} className="rounded-md border border-border px-4 py-3" />
        <input name="whatsapp" defaultValue={profile.whatsapp} className="rounded-md border border-border px-4 py-3" />
        <input name="license_number" defaultValue={profile.license_number} className="rounded-md border border-border px-4 py-3" />
        <input name="years_experience" type="number" defaultValue={profile.years_experience} className="rounded-md border border-border px-4 py-3" />
        <fieldset className="rounded-md border border-border p-3">
          <legend className="px-1 text-sm font-bold">Equipment owned</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {EQUIPMENT_OPTIONS.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                <input type="checkbox" name="equipment" value={item} defaultChecked={profile.equipment.includes(item)} />
                {item}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="grid gap-2 text-sm font-semibold">
          Districts served (hold Ctrl/Cmd to select multiple)
          <select
            name="districts_served"
            multiple
            defaultValue={profile.districts_served}
            className="min-h-40 rounded-md border border-border px-4 py-3"
          >
            {ALL_DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </label>
        <textarea name="bio" rows={4} defaultValue={profile.bio ?? ''} className="rounded-md border border-border px-4 py-3" />
        <label className="grid gap-2 text-sm font-semibold">
          Replace profile photo
          <input name="profile_photo" type="file" accept="image/jpeg,image/png" className="rounded-md border border-border px-4 py-3" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Replace license document
          <input name="license_doc" type="file" accept="image/jpeg,image/png,application/pdf" className="rounded-md border border-border px-4 py-3" />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input name="available" value="yes" type="checkbox" defaultChecked={profile.available} />
          Available for new work
        </label>
        <button className="rounded-md bg-primary px-5 py-3 font-bold text-white">Save Changes</button>
      </form>
      <button type="button" onClick={deleteAccount} className="mt-4 rounded-md border border-red-200 px-5 py-3 font-bold text-red-700">
        Delete Account
      </button>
      {message && <p className="mt-4 rounded-md bg-bg p-3 text-sm text-text-secondary">{message}</p>}
    </section>
  );
}
