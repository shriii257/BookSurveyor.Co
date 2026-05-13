'use client';

import { useMemo, useState } from 'react';
import { ALL_DISTRICTS, EQUIPMENT_OPTIONS } from '@/types/surveyor';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [sameWhatsapp, setSameWhatsapp] = useState(true);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [districtQuery, setDistrictQuery] = useState('');
  const filteredDistricts = useMemo(
    () =>
      ALL_DISTRICTS.filter((district) => district.toLowerCase().includes(districtQuery.toLowerCase())).slice(0, 80),
    [districtQuery],
  );

  async function submit(formData: FormData) {
    setStatus('submitting');
    setMessage('');

    const response = await fetch('/api/register', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus('error');
      setMessage(result.error ?? 'Registration failed.');
      return;
    }

    setStatus('success');
    setMessage('Your profile has been submitted for review. We will verify your license and activate your listing within 24 hours.');
    if (result.adminWhatsappUrl) {
      window.open(result.adminWhatsappUrl, '_blank', 'noopener,noreferrer');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-border bg-white p-6">
        <h2 className="text-2xl font-bold text-primary-dark">Profile submitted</h2>
        <p className="mt-3 leading-7 text-text-secondary">{message}</p>
      </div>
    );
  }

  return (
    <form action={submit} className="rounded-lg border border-border bg-white p-5">
      <div className="mb-6 grid grid-cols-3 gap-2 text-sm font-bold">
        {['Personal details', 'Professional details', 'Documents'].map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(index + 1)}
            className={`rounded-md px-3 py-2 ${step === index + 1 ? 'bg-primary text-white' : 'bg-bg text-text-secondary'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={step === 1 ? 'grid gap-4' : 'hidden'}>
        <label className="grid gap-2 text-sm font-semibold">
          Full name
          <input name="full_name" required className="rounded-md border border-border px-4 py-3" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Phone number
          <input name="phone" required inputMode="tel" className="rounded-md border border-border px-4 py-3" />
        </label>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" checked={sameWhatsapp} onChange={(event) => setSameWhatsapp(event.target.checked)} />
          Same WhatsApp number as phone
        </label>
        <label className={`grid gap-2 text-sm font-semibold ${sameWhatsapp ? 'hidden' : ''}`}>
          WhatsApp number
          <input name="whatsapp" inputMode="tel" className="rounded-md border border-border px-4 py-3" />
        </label>
        <input type="hidden" name="same_whatsapp" value={sameWhatsapp ? 'yes' : 'no'} />
        <label className="grid gap-2 text-sm font-semibold">
          Profile photo (JPG/PNG, max 2MB)
          <input name="profile_photo" type="file" accept="image/jpeg,image/png" className="rounded-md border border-border px-4 py-3" />
        </label>
      </div>

      <div className={step === 2 ? 'grid gap-4' : 'hidden'}>
        <label className="grid gap-2 text-sm font-semibold">
          License / certificate number
          <input name="license_number" required className="rounded-md border border-border px-4 py-3" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Years of experience
          <input name="years_experience" required type="number" min={0} className="rounded-md border border-border px-4 py-3" />
        </label>
        <fieldset>
          <legend className="text-sm font-semibold">Equipment owned</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {EQUIPMENT_OPTIONS.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                <input type="checkbox" name="equipment" value={item} />
                {item}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="grid gap-2 text-sm font-semibold">
          Search districts
          <input
            value={districtQuery}
            onChange={(event) => setDistrictQuery(event.target.value)}
            placeholder="Type to filter districts"
            className="rounded-md border border-border px-4 py-3"
          />
        </label>
        <fieldset>
          <legend className="text-sm font-semibold">Districts served (max 5)</legend>
          <div className="mt-3 grid max-h-56 gap-2 overflow-y-auto rounded-md border border-border p-3 sm:grid-cols-2">
            {filteredDistricts.map((district) => (
              <label key={district} className="flex items-center gap-2 text-sm text-text-secondary">
                <input type="checkbox" name="districts_served" value={district} />
                {district}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="grid gap-2 text-sm font-semibold">
          Short bio (optional, max 300 characters)
          <textarea name="bio" maxLength={300} rows={4} className="rounded-md border border-border px-4 py-3" />
        </label>
      </div>

      <div className={step === 3 ? 'grid gap-4' : 'hidden'}>
        <label className="grid gap-2 text-sm font-semibold">
          License / certificate document (JPG/PNG/PDF, max 5MB)
          <input
            name="license_doc"
            required
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            className="rounded-md border border-border px-4 py-3"
          />
        </label>
        <label className="flex items-start gap-2 text-sm text-text-secondary">
          <input type="checkbox" name="declaration" value="yes" required className="mt-1" />
          I confirm all details are accurate.
        </label>
      </div>

      {status === 'error' && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{message}</p>}

      <div className="mt-6 flex justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((value) => Math.max(1, value - 1))}
          className="rounded-md border border-border px-5 py-3 font-bold"
        >
          Back
        </button>
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((value) => Math.min(3, value + 1))}
            className="rounded-md bg-primary px-5 py-3 font-bold text-white"
          >
            Next
          </button>
        ) : (
          <button disabled={status === 'submitting'} className="rounded-md bg-primary px-5 py-3 font-bold text-white disabled:opacity-60">
            {status === 'submitting' ? 'Submitting...' : 'Submit for review'}
          </button>
        )}
      </div>
    </form>
  );
}
