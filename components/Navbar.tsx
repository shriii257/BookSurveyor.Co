import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { Locale } from '@/i18n';

type NavbarMessages = {
  nav: {
    home: string;
    registerSurveyor: string;
  };
};

export function Navbar({ locale, messages }: { locale: Locale; messages: NavbarMessages }) {
  const lang = `?lang=${locale}`;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href={`/${lang}`} className="text-lg font-extrabold text-primary-dark sm:text-xl">
          Booksurveyor.co
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href={`/${lang}`} className="hidden text-sm font-semibold text-text-secondary hover:text-text-primary sm:inline">
            {messages.nav.home}
          </Link>
          <LanguageSwitcher currentLocale={locale} />
          <Link
            href={`/register${lang}`}
            className="rounded-md bg-primary px-3 py-2 text-sm font-bold text-white hover:bg-primary-dark sm:px-4"
          >
            {messages.nav.registerSurveyor}
          </Link>
        </nav>
      </div>
    </header>
  );
}
