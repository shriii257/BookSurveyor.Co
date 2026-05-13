import { notFound } from 'next/navigation';
import { Avatar } from '@/components/Avatar';
import { EquipmentPills } from '@/components/EquipmentPills';
import { Navbar } from '@/components/Navbar';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { whatsappLink } from '@/components/SurveyorCard';
import { getLocaleFromValue, getMessages } from '@/lib/i18n';
import { getSurveyorById } from '@/lib/search';

export default async function SurveyorProfilePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { lang?: string; district?: string };
}) {
  const locale = getLocaleFromValue(searchParams.lang);
  const messages = getMessages(locale);
  const surveyor = await getSurveyorById(params.id);

  if (!surveyor || !surveyor.admin_approved) notFound();

  const district = searchParams.district || surveyor.districts_served[0];

  return (
    <main>
      <Navbar locale={locale} messages={messages} />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-lg border border-border bg-white p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <Avatar name={surveyor.full_name} src={surveyor.profile_photo_url} size="lg" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-extrabold">{surveyor.full_name}</h1>
                <VerifiedBadge />
              </div>
              <p className="mt-3 text-lg font-bold text-primary-dark">Lic. {surveyor.license_number}</p>
              <p className="mt-2 text-text-secondary">{surveyor.years_experience} years of experience</p>
              {surveyor.bio && <p className="mt-5 max-w-3xl leading-7 text-text-secondary">{surveyor.bio}</p>}
              <div className="mt-5">
                <h2 className="mb-2 font-bold">Equipment owned</h2>
                <EquipmentPills items={surveyor.equipment} />
              </div>
              <div className="mt-5">
                <h2 className="mb-2 font-bold">Districts served</h2>
                <div className="flex flex-wrap gap-2">
                  {surveyor.districts_served.map((item) => (
                    <span key={item} className="rounded-md border border-border px-3 py-1 text-sm text-text-secondary">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a href={`tel:+${surveyor.phone}`} className="rounded-md border border-border px-5 py-3 text-center font-bold">
                  Call
                </a>
                <a href={whatsappLink(surveyor, district)} className="rounded-md bg-primary px-5 py-3 text-center font-bold text-white">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-bg p-5">
            <h2 className="font-bold">License document preview</h2>
            <p className="mt-2 text-sm text-text-secondary">
              License documents are stored privately and visible only in the admin panel.
            </p>
          </div>
        </div>
        <p className="mt-5 text-center text-sm text-text-secondary">Listed on BookSurveyor.co</p>
      </section>
    </main>
  );
}
