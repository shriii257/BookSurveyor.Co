'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { locales, type Locale } from '@/i18n';

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState<Locale>(currentLocale);

  useEffect(() => {
    const saved = window.localStorage.getItem('booksurveyor-locale') as Locale | null;
    if (saved && locales.includes(saved) && saved !== currentLocale) {
      setLocale(saved);
    }
  }, [currentLocale]);

  function changeLocale(nextLocale: Locale) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', nextLocale);
    window.localStorage.setItem('booksurveyor-locale', nextLocale);
    setLocale(nextLocale);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex rounded-md border border-border bg-white p-1" aria-label="Language switcher">
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => changeLocale(item)}
          className={`rounded px-3 py-1.5 text-xs font-bold uppercase ${
            item === locale ? 'bg-primary text-white' : 'text-text-secondary hover:bg-bg'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
