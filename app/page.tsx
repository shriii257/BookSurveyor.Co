import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { SurveyorCard } from '@/components/SurveyorCard';
import { getLocaleFromValue, getMessages } from '@/lib/i18n';
import { searchSurveyors } from '@/lib/search';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const locale = getLocaleFromValue(searchParams.lang);
  const messages = getMessages(locale);
  const { data: featuredSurveyors } = await searchSurveyors({ district: 'Pune', sort: 'experience', page: 1 });
  const popularDistricts = ['Pune', 'Nashik', 'Aurangabad', 'Nagpur', 'Mumbai'];

  return (
    <main>
      <Navbar locale={locale} messages={messages} />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:py-16">
        <div>
          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-text-primary sm:text-6xl">
            {messages.hero.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">{messages.hero.subtext}</p>
          <div className="mt-8">
            <SearchBar locale={locale} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="py-2 font-semibold text-text-secondary">{messages.hero.popularDistricts}</span>
            {popularDistricts.map((district) => (
              <Link
                key={district}
                href={`/search?district=${district}&lang=${locale}`}
                className="rounded-md border border-border bg-white px-3 py-2 font-semibold hover:border-primary"
              >
                {district}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid gap-3 rounded-lg border border-border bg-white p-5">
          {[
            ['1,200+', messages.stats.surveyors],
            ['90+', messages.stats.districts],
            ['Free', messages.stats.free],
          ].map(([value, label]) => (
            <div key={label} className="rounded-md bg-bg p-5">
              <div className="text-3xl font-extrabold text-primary-dark">{value}</div>
              <div className="mt-1 text-sm text-text-secondary">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-extrabold">{messages.featured.title}</h2>
              <p className="mt-2 text-text-secondary">Showing popular verified surveyors near Pune.</p>
            </div>
            <Link href={`/search?district=Pune&lang=${locale}`} className="rounded-md border border-border px-4 py-3 font-bold">
              View search results
            </Link>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {featuredSurveyors.slice(0, 3).map((surveyor) => (
              <SurveyorCard key={surveyor.id} surveyor={surveyor} district="Pune" locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[320px_1fr]">
        <div>
          <h2 className="text-3xl font-extrabold">{messages.howItWorks.title}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [messages.howItWorks.step1Title, messages.howItWorks.step1Desc],
            [messages.howItWorks.step2Title, messages.howItWorks.step2Desc],
            [messages.howItWorks.step3Title, messages.howItWorks.step3Desc],
          ].map(([title, desc], index) => (
            <div key={title} className="rounded-lg border border-border bg-white p-5">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
                {index + 1}
              </div>
              <h3 className="font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="register" className="bg-primary-dark py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-extrabold">{messages.cta.surveyorTitle}</h2>
            <p className="mt-2 max-w-2xl text-white/80">{messages.cta.surveyorSubtext}</p>
          </div>
          <Link href={`/register?lang=${locale}`} className="rounded-md bg-white px-5 py-3 text-center font-bold text-primary-dark">
            {messages.cta.surveyorButton}
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <strong className="text-text-primary">Booksurveyor.co.co.co</strong>
        <div className="flex gap-4">
          <Link href={`/?lang=${locale}`}>{messages.footer.about}</Link>
          <Link href={`/?lang=${locale}`}>{messages.footer.contact}</Link>
          <Link href={`/register?lang=${locale}`}>{messages.footer.register}</Link>
        </div>
      </footer>
    </main>
  );
}
