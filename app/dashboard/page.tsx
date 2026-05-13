import { DashboardClient } from '@/components/DashboardClient';
import { Navbar } from '@/components/Navbar';
import { getLocaleFromValue, getMessages } from '@/lib/i18n';

export default function DashboardPage({ searchParams }: { searchParams: { lang?: string } }) {
  const locale = getLocaleFromValue(searchParams.lang);
  const messages = getMessages(locale);

  return (
    <main>
      <Navbar locale={locale} messages={messages} />
      <div className="px-4 py-10 sm:px-6">
        <DashboardClient />
      </div>
    </main>
  );
}
