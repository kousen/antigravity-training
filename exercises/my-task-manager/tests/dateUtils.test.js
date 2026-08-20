import { parseHumanDate, isDateOverdue, formatDate } from '../src/dateUtils.js';

describe('dateUtils', () => {
  test('formats Date object to YYYY-MM-DD', () => {
    const d = new Date(2026, 7, 20); // Aug 20, 2026
    expect(formatDate(d)).toBe('2026-08-20');
  });

  test('parses "today"', () => {
    const today = formatDate(new Date());
    expect(parseHumanDate('today')).toBe(today);
    expect(parseHumanDate('TOD')).toBe(today);
  });

  test('parses "tomorrow"', () => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    expect(parseHumanDate('tomorrow')).toBe(formatDate(tmrw));
    expect(parseHumanDate('tmrw')).toBe(formatDate(tmrw));
  });

  test('parses relative dates like "+3d" and "+5"', () => {
    const future3 = new Date();
    future3.setDate(future3.getDate() + 3);
    expect(parseHumanDate('+3d')).toBe(formatDate(future3));
    expect(parseHumanDate('+3')).toBe(formatDate(future3));
    expect(parseHumanDate('+3days')).toBe(formatDate(future3));
  });

  test('parses standard YYYY-MM-DD string', () => {
    expect(parseHumanDate('2026-11-25')).toBe('2026-11-25');
  });

  test('returns null for empty or invalid strings', () => {
    expect(parseHumanDate('')).toBeNull();
    expect(parseHumanDate(null)).toBeNull();
    expect(parseHumanDate('invalid-date-string-xyz')).toBeNull();
  });

  test('checks if date is overdue relative to reference date', () => {
    const ref = new Date('2026-08-20T12:00:00');
    expect(isDateOverdue('2026-08-19', ref)).toBe(true);
    expect(isDateOverdue('2026-08-20', ref)).toBe(false);
    expect(isDateOverdue('2026-08-21', ref)).toBe(false);
    expect(isDateOverdue(null, ref)).toBe(false);
  });
});
