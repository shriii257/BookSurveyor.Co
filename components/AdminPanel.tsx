'use client';

import { useState } from 'react';
import type { Surveyor } from '@/types/surveyor';

type AdminSurveyor = Surveyor & { license_doc_signed_url?: string | null };

export function AdminPanel() {
  const [password, setPassword] = useState('');
  const [items, setItems] = useState<AdminSurveyor[]>([]);
  const [message, setMessage] = useState('');

  async function load() {
    const response = await fetch(`/api/admin/surveyors?password=${encodeURIComponent(password)}`);
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error ?? 'Unable to load registrations.');
      return;
    }
    setItems(result.surveyors);
    setMessage('');
  }

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    const response = await fetch('/api/admin/surveyors', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, id, status }),
    });
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error ?? 'Unable to update status.');
      return;
    }
    setItems((current) => current.map((item) => (item.id === id ? result.surveyor : item)));
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="rounded-lg border border-border bg-white p-5">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Admin password"
            className="min-h-12 flex-1 rounded-md border border-border px-4"
          />
          <button type="button" onClick={load} className="rounded-md bg-primary px-5 py-3 font-bold text-white">
            Load registrations
          </button>
        </div>
        {message && <p className="mt-4 rounded-md bg-bg p-3 text-sm text-text-secondary">{message}</p>}
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-bg text-text-secondary">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">License</th>
              <th className="p-3">District</th>
              <th className="p-3">Submitted</th>
              <th className="p-3">Status</th>
              <th className="p-3">Document</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border">
                <td className="p-3 font-semibold">{item.full_name}</td>
                <td className="p-3">{item.phone}</td>
                <td className="p-3">{item.license_number}</td>
                <td className="p-3">{item.districts_served[0]}</td>
                <td className="p-3">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="p-3 capitalize">{item.status}</td>
                <td className="p-3">
                  {item.license_doc_signed_url ? (
                    <a className="font-semibold text-primary-dark" href={item.license_doc_signed_url} target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : (
                    'None'
                  )}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => updateStatus(item.id, 'approved')} className="rounded-md bg-primary px-3 py-2 font-bold text-white">
                      Approve
                    </button>
                    <button type="button" onClick={() => updateStatus(item.id, 'rejected')} className="rounded-md border border-border px-3 py-2 font-bold">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-text-secondary">
                  Enter the admin password to load registrations.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
