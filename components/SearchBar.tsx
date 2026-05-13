import { Search } from 'lucide-react';
import type { Locale } from '@/i18n';

export function SearchBar({
  defaultDistrict = '',
  locale,
  sticky = false,
}: {
  defaultDistrict?: string;
  locale: Locale;
  sticky?: boolean;
}) {
  return (
    <form
      action="/search"
      className={`${sticky ? 'sticky top-[73px] z-20 border-b border-border bg-white p-3' : ''}`}
    >
      <input type="hidden" name="lang" value={locale} />
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-lg border border-border bg-white p-3 sm:flex-row">
        <label className="sr-only" htmlFor="district">
          District
        </label>
        <input
          id="district"
          name="district"
          defaultValue={defaultDistrict}
          placeholder="Enter district or city..."
          className="min-h-12 flex-1 rounded-md border border-border px-4 outline-none focus:border-primary"
        />
        <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 font-bold text-white hover:bg-primary-dark">
          <Search className="h-4 w-4" aria-hidden="true" />
          Search
        </button>
      </div>
    </form>
  );
}
