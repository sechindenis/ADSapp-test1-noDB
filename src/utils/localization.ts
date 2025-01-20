import { getRepeatsForm } from '../i18n/utils';

interface LocalizationForms {
  one: string;
  few?: string;
  many?: string;
  other: string;
}

export function getLocalizedForm(count: number, language: string): string {
  return getRepeatsForm(count, language);
}

export function formatLocalizedNumber(
  number: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(number);
}