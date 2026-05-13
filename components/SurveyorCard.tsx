import Link from 'next/link';
import { MapPin } from 'lucide-react';
import type { Surveyor } from '@/types/surveyor';
import { EquipmentPills } from './EquipmentPills';
import { VerifiedBadge } from './VerifiedBadge';
import { Avatar } from './Avatar';

export function whatsappLink(surveyor: Surveyor, district?: string) {
  const searchedDistrict = district || surveyor.districts_served[0] || 'your area';
  const message = encodeURIComponent(
    `Hi, I found you on BookSurveyor.co and need a land survey in ${searchedDistrict}`,
  );
  return `https://wa.me/${surveyor.whatsapp}?text=${message}`;
}

export function SurveyorCard({
  surveyor,
  district,
  locale = 'en',
}: {
  surveyor: Surveyor;
  district?: string;
  locale?: string;
}) {
  const primaryDistrict = district || surveyor.districts_served[0];
  const otherDistricts = surveyor.districts_served.filter((item) => item !== primaryDistrict);

  return (
    <article className="rounded-lg border border-border bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Avatar name={surveyor.full_name} src={surveyor.profile_photo_url} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Link href={`/surveyor/${surveyor.id}?lang=${locale}&district=${encodeURIComponent(primaryDistrict)}`}>
                <h3 className="text-xl font-bold text-text-primary hover:text-primary-dark">{surveyor.full_name}</h3>
              </Link>
              <p className="mt-1 text-sm text-text-secondary">Lic. {surveyor.license_number}</p>
            </div>
            {surveyor.admin_approved && <VerifiedBadge />}
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-text-secondary">
            <MapPin className="h-4 w-4 text-primary-dark" aria-hidden="true" />
            {primaryDistrict}
          </div>

          <div className="mt-4">
            <EquipmentPills items={surveyor.equipment} />
          </div>

          {otherDistricts.length > 0 && (
            <p className="mt-3 text-sm text-text-secondary">Also serves: {otherDistricts.join(', ')}</p>
          )}

          <p className="mt-2 text-sm font-semibold text-text-primary">{surveyor.years_experience} years of experience</p>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <a
              href={`tel:+${surveyor.phone}`}
              className="rounded-md border border-border px-4 py-3 text-center font-bold text-text-primary hover:border-primary"
            >
              Call
            </a>
            <a
              href={whatsappLink(surveyor, primaryDistrict)}
              className="rounded-md bg-primary px-4 py-3 text-center font-bold text-white hover:bg-primary-dark"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
