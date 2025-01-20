export function getRepeatsForm(count: number, language: string): string {
  if (language === 'ru') {
    // Russian plural rules
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'repeat_many';
    }

    if (lastDigit === 1) {
      return 'repeat_one';
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'repeat_few';
    }

    return 'repeat_many';
  }

  // English plural rules
  return count === 1 ? 'repeat_one' : 'repeat_other';
}