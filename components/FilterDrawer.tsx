'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { FilterSidebar } from './FilterSidebar';
import type { Locale } from '@/i18n';

export function FilterDrawer({
  district,
  locale,
  selectedEquipment,
  selectedExperience,
}: {
  district: string;
  locale: Locale;
  selectedEquipment: string[];
  selectedExperience: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-4 py-3 font-bold md:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Filter
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 md:hidden">
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-lg bg-bg p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-border bg-white p-2">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <FilterSidebar
              district={district}
              locale={locale}
              selectedEquipment={selectedEquipment}
              selectedExperience={selectedExperience}
            />
          </div>
        </div>
      )}
    </>
  );
}
