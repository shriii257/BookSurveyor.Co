import en from '@/messages/en.json';
import hi from '@/messages/hi.json';
import mr from '@/messages/mr.json';
import { type Locale, locales } from '@/i18n';

const dictionaries = { en, hi, mr };

export function getLocaleFromValue(value?: string | string[] | null): Locale {
  const locale = Array.isArray(value) ? value[0] : value;
  return locales.includes(locale as Locale) ? (locale as Locale) : 'en';
}

export function getMessages(locale: Locale) {
  return dictionaries[locale];
}

export function withLang(path: string, locale: Locale) {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}lang=${locale}`;
}
