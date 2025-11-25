import { formatDate, formatDateRange, getYear } from './dateServices';

describe('dateServices', () => {
  describe('formatDate', () => {
    it('formats ISO date correctly', () => {
      const result = formatDate('2020-01-15');
      expect(result).toBe('Jan 15, 2020');
    });

    it('formats date with single digit day', () => {
      const result = formatDate('2020-01-05');
      expect(result).toBe('Jan 5, 2020');
    });

    it('formats date in different month', () => {
      const result = formatDate('2020-12-25');
      expect(result).toBe('Dec 25, 2020');
    });

    it('handles leap year dates', () => {
      const result = formatDate('2020-02-29');
      expect(result).toBe('Feb 29, 2020');
    });
  });

  describe('formatDateRange', () => {
    it('formats date range in same month', () => {
      const result = formatDateRange('2020-01-01', '2020-01-31');
      expect(result).toBe('Jan 01 - 31, 2020');
    });

    it('formats date range in different months, same year', () => {
      const result = formatDateRange('2020-01-01', '2020-02-28');
      expect(result).toBe('Jan 01 - Feb 28, 2020');
    });

    it('formats date range across different years', () => {
      const result = formatDateRange('2019-12-15', '2020-01-15');
      expect(result).toBe('Dec 15, 2019 - Jan 15, 2020');
    });

    it('formats date range with single digit days', () => {
      const result = formatDateRange('2020-01-05', '2020-01-09');
      expect(result).toBe('Jan 05 - 09, 2020');
    });

    it('handles end of year to beginning of next year', () => {
      const result = formatDateRange('2020-12-31', '2021-01-01');
      expect(result).toBe('Dec 31, 2020 - Jan 01, 2021');
    });
  });

  describe('getYear', () => {
    it('extracts year correctly', () => {
      expect(getYear('2020-06-15')).toBe(2020);
    });

    it('extracts year from beginning of year', () => {
      expect(getYear('2020-01-01')).toBe(2020);
    });

    it('extracts year from end of year', () => {
      expect(getYear('2020-12-31')).toBe(2020);
    });

    it('handles different years', () => {
      expect(getYear('2019-06-15')).toBe(2019);
      expect(getYear('2021-06-15')).toBe(2021);
    });
  });
});

