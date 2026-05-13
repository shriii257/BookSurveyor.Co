import { redirect } from 'next/navigation';
import { locales, type Locale } from '@/i18n';

export default function LegacyLocalePage({ params }: { params: { locale: string } }) {
  if (locales.includes(params.locale as Locale)) {
    redirect(`/?lang=${params.locale}`);
  }
  redirect('/');
}
