import { formatDate, formatLakh, formatPrice, formatSmart, getInitials } from './helpers';

describe('helpers', () => {
  test('formats taka with South Asian grouping', () => {
    expect(formatPrice(550000)).toBe('৳5,50,000');
    expect(formatPrice(0)).toBe('৳0');
  });

  test('formats lakh and hazar amounts', () => {
    expect(formatLakh(550000)).toBe('৳5.5 লাখ');
    expect(formatLakh(520000)).toBe('৳5.2 লাখ');
    expect(formatSmart(15600)).toBe('৳15.6 হাজার');
    expect(formatSmart(504400)).toBe('৳5.04 লাখ');
  });

  test('formats dates and initials', () => {
    expect(formatDate('2026-10-19T12:00:00.000Z')).toBe('19 Oct 2026');
    expect(getInitials('Arjun Patel')).toBe('AP');
    expect(getInitials('Rahim')).toBe('R');
  });
});
