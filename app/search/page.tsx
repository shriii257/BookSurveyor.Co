import Link from 'next/link';
import { FilterDrawer } from '@/components/FilterDrawer';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { SurveyorCard } from '@/components/SurveyorCard';
import { getLocaleFromValue, getMessages } from '@/lib/i18n';
import { searchSurveyors } from '@/lib/search';

function values(value?: string | string[]) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function filterUrl(params: Record<string, string | string[] | undefined>, removeKey: string, removeValue?: string) {
  const url = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    values(value).forEach((item) => {
      if (key === removeKey && (!removeValue || item === removeValue)) return;
      url.append(key, item);
    });
  });
  return `/search?${url.toString()}`;
}

function pageUrl(params: Record<string, string | string[] | undefined>, nextPage: number) {
  const url = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (key === 'page') return;
    values(value).forEach((item) => url.append(key, item));
  });
  url.set('page', String(nextPage));
  return `/search?${url.toString()}`;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: {
    district?: string;
    equipment?: string | string[];
    experience?: string | string[];
    sort?: 'experience' | 'newest' | 'name';
    page?: string;
    lang?: string;
  };
}) {
  const locale = getLocaleFromValue(searchParams.lang);
  const messages = getMessages(locale);
  const district = searchParams.district ?? '';
  const selectedEquipment = values(searchParams.equipment);
  const selectedExperience = values(searchParams.experience);
  const sort = searchParams.sort ?? 'experience';
  const page = Number(searchParams.page ?? 1);
  const result = await searchSurveyors({
    district,
    equipment: selectedEquipment,
    experience: selectedExperience,
    sort,
    page,
  });

  const baseParams = { ...searchParams, lang: locale };
  const totalPages = Math.max(1, Math.ceil(result.count / 10));

  return (
    <main>
      <Navbar locale={locale} messages={messages} />
      <SearchBar defaultDistrict={district} locale={locale} sticky />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 md:grid-cols-[280px_1fr]">
        <aside className="hidden md:block">
          <FilterSidebar
            district={district}
            locale={locale}
            selectedEquipment={selectedEquipment}
            selectedExperience={selectedExperience}
          />
        </aside>
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <FilterDrawer
              district={district}
              locale={locale}
              selectedEquipment={selectedEquipment}
              selectedExperience={selectedExperience}
            />
            <div>
              <h1 className="text-2xl font-extrabold">
                {result.count} surveyor(s) found {district ? `in ${district}` : ''}
              </h1>
              {result.source === 'demo' && (
                <p className="mt-1 text-sm text-text-secondary">Demo data is shown until Supabase credentials are added.</p>
              )}
            </div>
            <form action="/search" className="flex items-center gap-2">
              <input type="hidden" name="lang" value={locale} />
              <input type="hidden" name="district" value={district} />
              {selectedEquipment.map((item) => (
                <input key={item} type="hidden" name="equipment" value={item} />
              ))}
              {selectedExperience.map((item) => (
                <input key={item} type="hidden" name="experience" value={item} />
              ))}
              <select name="sort" defaultValue={sort} className="rounded-md border border-border bg-white px-3 py-2 text-sm">
                <option value="experience">Experience</option>
                <option value="newest">Newest listed</option>
                <option value="name">Name A-Z</option>
              </select>
              <button className="rounded-md bg-primary px-3 py-2 text-sm font-bold text-white">Sort</button>
            </form>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {selectedEquipment.map((item) => (
              <Link key={item} href={filterUrl(baseParams, 'equipment', item)} className="rounded-md bg-primary-light px-3 py-1 text-sm font-semibold text-primary-dark">
                {item} x
              </Link>
            ))}
            {selectedExperience.map((item) => (
              <Link key={item} href={filterUrl(baseParams, 'experience', item)} className="rounded-md bg-primary-light px-3 py-1 text-sm font-semibold text-primary-dark">
                {item} x
              </Link>
            ))}
            {(selectedEquipment.length > 0 || selectedExperience.length > 0) && (
              <Link href={`/search?district=${encodeURIComponent(district)}&lang=${locale}`} className="rounded-md border border-border bg-white px-3 py-1 text-sm font-semibold">
                Clear all
              </Link>
            )}
          </div>

          <div className="grid gap-4">
            {result.data.map((surveyor) => (
              <SurveyorCard key={surveyor.id} surveyor={surveyor} district={district} locale={locale} />
            ))}
            {result.data.length === 0 && (
              <div className="rounded-lg border border-border bg-white p-8 text-center text-text-secondary">
                No surveyors found in {district || 'this area'}. Try a nearby district.
              </div>
            )}
          </div>

          {page < totalPages && (
            <Link
              href={pageUrl(baseParams, page + 1)}
              className="mt-6 block rounded-md border border-border bg-white px-5 py-3 text-center font-bold"
            >
              Load more
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
