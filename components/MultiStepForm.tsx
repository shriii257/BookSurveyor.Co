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
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  const filteredDistricts = useMemo(
    () =>
      ALL_DISTRICTS.filter((district) =>
        district.toLowerCase().includes(districtQuery.toLowerCase()),
      ).slice(0, 80),
    [districtQuery],
  );

  function toggleDistrict(district: string) {
    setSelectedDistricts((prev) => {
      if (prev.includes(district)) {
        return prev.filter((d) => d !== district);
      }
      if (prev.length >= 5) return prev;
      return [...prev, district];
    });
  }

  async function submit(formData: FormData) {
    setStatus('submitting');
    setMessage('');

    // Append selected districts to formData
    selectedDistricts.forEach((d) => formData.append('districts_served', d));

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
    setMessage(
      'Your profile has been submitted for review. We will verify and activate your listing within 24 hours.',
    );
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

      {/* Step 1: Personal details */}
      <div className={step === 1 ? 'grid gap-4' : 'hidden'}>
        <label className="grid gap-2 text-sm font-semibold">
          Full name <span className="text-red-500">*</span>
          <input name="full_name" required className="rounded-md border border-border px-4 py-3" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Phone number <span className="text-red-500">*</span>
          <input name="phone" required inputMode="tel" className="rounded-md border border-border px-4 py-3" />
        </label>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={sameWhatsapp}
            onChange={(event) => setSameWhatsapp(event.target.checked)}
          />
          Same WhatsApp number as phone
        </label>
        <label className={`grid gap-2 text-sm font-semibold ${sameWhatsapp ? 'hidden' : ''}`}>
          WhatsApp number
          <input name="whatsapp" inputMode="tel" className="rounded-md border border-border px-4 py-3" />
        </label>
        <input type="hidden" name="same_whatsapp" value={sameWhatsapp ? 'yes' : 'no'} />
        <label className="grid gap-2 text-sm font-semibold">
          Profile photo (JPG/PNG, max 2MB){' '}
          <span className="text-xs font-normal text-text-secondary">(optional)</span>
          <input
            name="profile_photo"
            type="file"
            accept="image/jpeg,image/png"
            className="rounded-md border border-border px-4 py-3"
          />
        </label>
      </div>

      {/* Step 2: Professional details */}
      <div className={step === 2 ? 'grid gap-4' : 'hidden'}>
        <label className="grid gap-2 text-sm font-semibold">
          License / certificate number{' '}
          <span className="text-xs font-normal text-text-secondary">(optional)</span>
          <input
            name="license_number"
            className="rounded-md border border-border px-4 py-3"
            placeholder="e.g. MH-1234 (leave blank if none)"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          GST number{' '}
          <span className="text-xs font-normal text-text-secondary">(optional)</span>
          <input
            name="gst_number"
            className="rounded-md border border-border px-4 py-3"
            placeholder="e.g. 27AAAAA0000A1Z5 (leave blank if none)"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Years of experience <span className="text-red-500">*</span>
          <input
            name="years_experience"
            required
            type="number"
            min={0}
            className="rounded-md border border-border px-4 py-3"
          />
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

        {/* District selection with real-time count */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">
              Districts served <span className="text-red-500">*</span>
            </span>
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                selectedDistricts.length === 5
                  ? 'bg-red-100 text-red-700'
                  : selectedDistricts.length > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-bg text-text-secondary'
              }`}
            >
              {selectedDistricts.length} / 5 selected
            </span>
          </div>

          {/* Selected district chips */}
          {selectedDistricts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedDistricts.map((d) => (
                <span
                  key={d}
                  className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white"
                >
                  {d}
                  <button
                    type="button"
                    onClick={() => toggleDistrict(d)}
                    className="ml-1 hover:opacity-70"
                    aria-label={`Remove ${d}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}

          <input
            value={districtQuery}
            onChange={(event) => setDistrictQuery(event.target.value)}
            placeholder="Type to search districts…"
            className="rounded-md border border-border px-4 py-3 text-sm"
          />

          <div className="max-h-56 overflow-y-auto rounded-md border border-border p-3">
            {filteredDistricts.length === 0 && (
              <p className="text-sm text-text-secondary">No districts match your search.</p>
            )}
            <div className="grid gap-1 sm:grid-cols-2">
              {filteredDistricts.map((district) => {
                const checked = selectedDistricts.includes(district);
                const disabled = !checked && selectedDistricts.length >= 5;
                return (
                  <label
                    key={district}
                    className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm ${
                      checked
                        ? 'bg-primary/10 font-semibold text-primary-dark'
                        : disabled
                          ? 'cursor-not-allowed text-text-secondary opacity-40'
                          : 'text-text-secondary hover:bg-bg'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleDistrict(district)}
                      className="accent-primary"
                    />
                    {district}
                  </label>
                );
              })}
            </div>
          </div>

          {selectedDistricts.length === 5 && (
            <p className="text-xs font-semibold text-red-600">Maximum of 5 districts reached.</p>
          )}
        </div>

        <label className="grid gap-2 text-sm font-semibold">
          Short bio (optional, max 300 characters)
          <textarea name="bio" maxLength={300} rows={4} className="rounded-md border border-border px-4 py-3" />
        </label>
      </div>

      {/* Step 3: Documents */}
      <div className={step === 3 ? 'grid gap-4' : 'hidden'}>
        <div className="rounded-md bg-bg p-4 text-sm text-text-secondary">
          Documents are stored privately and visible only to our admin for verification. Uploading them helps us verify your profile faster, but they are optional.
        </div>
        <label className="grid gap-2 text-sm font-semibold">
          License / certificate document (JPG/PNG/PDF, max 5MB){' '}
          <span className="text-xs font-normal text-text-secondary">(optional)</span>
          <input
            name="license_doc"
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            className="rounded-md border border-border px-4 py-3"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          GST document (JPG/PNG/PDF, max 5MB){' '}
          <span className="text-xs font-normal text-text-secondary">(optional)</span>
          <input
            name="gst_doc"
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            className="rounded-md border border-border px-4 py-3"
          />
        </label>
        <label className="flex items-start gap-2 text-sm text-text-secondary">
          <input type="checkbox" name="declaration" value="yes" required className="mt-1" />
          I confirm all details provided are accurate.
        </label>
      </div>

      {status === 'error' && (
        <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{message}</p>
      )}

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
          <button
            disabled={status === 'submitting'}
            className="rounded-md bg-primary px-5 py-3 font-bold text-white disabled:opacity-60"
          >
            {status === 'submitting' ? 'Submitting…' : 'Submit for review'}
          </button>
        )}
      </div>
    </form>
  );
}
