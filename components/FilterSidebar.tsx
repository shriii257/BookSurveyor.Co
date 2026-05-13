import { ALL_DISTRICTS, EQUIPMENT_OPTIONS, EXPERIENCE_RANGES } from '@/types/surveyor';
import type { Locale } from '@/i18n';

export function FilterSidebar({
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
  return (
    <form action="/search" className="rounded-lg border border-border bg-white p-5">
      <input type="hidden" name="lang" value={locale} />
      <h2 className="text-lg font-bold">Filters</h2>

      <fieldset className="mt-5">
        <legend className="font-semibold">Equipment</legend>
        <div className="mt-3 grid gap-2">
          {EQUIPMENT_OPTIONS.map((item) => (
            <label key={item} className="flex items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" name="equipment" value={item} defaultChecked={selectedEquipment.includes(item)} />
              {item}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="font-semibold">Experience</legend>
        <div className="mt-3 grid gap-2">
          {EXPERIENCE_RANGES.map((range) => (
            <label key={range.value} className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                name="experience"
                value={range.value}
                defaultChecked={selectedExperience.includes(range.value)}
              />
              {range.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="font-semibold">District</legend>
        <select name="district" defaultValue={district} className="mt-3 w-full rounded-md border border-border px-3 py-2 text-sm">
          <option value="">All districts</option>
          {ALL_DISTRICTS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </fieldset>

      <button className="mt-5 w-full rounded-md bg-primary px-4 py-3 font-bold text-white hover:bg-primary-dark">
        Apply filters
      </button>
    </form>
  );
}
