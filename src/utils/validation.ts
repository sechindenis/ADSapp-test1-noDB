import { t } from '../i18n';

export function validateGoalName(name: string): { isValid: boolean; message?: string } {
  if (!name.trim()) {
    return { isValid: false, message: t('nameRequired') };
  }
  if (name.length > 35) {
    return { isValid: false, message: t('maxLengthReached') };
  }
  return { isValid: true };
}

export function validateRepeatsCount(
  repeats: number | string,
  minRepeats?: number
): { isValid: boolean; message?: string } {
  const repeatsNum = typeof repeats === 'string' ? parseInt(repeats) : repeats;

  if (!repeats || isNaN(repeatsNum)) {
    return { isValid: false, message: t('repeatsRequired') };
  }
  if (repeatsNum <= 0) {
    return { isValid: false, message: t('repeatsPositive') };
  }
  if (minRepeats && repeatsNum < minRepeats) {
    return { 
      isValid: false, 
      message: t('minRepeatsError').replace('{0}', minRepeats.toString()) 
    };
  }
  return { isValid: true };
}

export function validateNumericInput(value: string): string {
  return value.replace(/[^0-9]/g, '');
}