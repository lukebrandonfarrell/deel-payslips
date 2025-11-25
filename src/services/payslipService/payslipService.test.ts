import { fetchPayslipById, fetchPayslips, getAvailableYears } from './payslipService';

jest.mock('../../data/payslips.json', () => ({
  payslips: [
    {
      id: '1',
      fromDate: '2020-01-01',
      toDate: '2020-01-31',
      filePath: 'sample-payslip.pdf',
      fileType: 'pdf' as const,
    },
    {
      id: '2',
      fromDate: '2020-02-01',
      toDate: '2020-02-29',
      filePath: 'sample-payslip.pdf',
      fileType: 'pdf' as const,
    },
    {
      id: '3',
      fromDate: '2020-03-01',
      toDate: '2020-03-31',
      filePath: 'sample-payslip.pdf',
      fileType: 'pdf' as const,
    },
    {
      id: '4',
      fromDate: '2021-01-01',
      toDate: '2021-01-31',
      filePath: 'sample-payslip.pdf',
      fileType: 'pdf' as const,
    },
  ],
}), { virtual: true });

// Mock the asset require
jest.mock('../../../assets/sample-payslip.pdf', () => 'mock-pdf-asset', { virtual: true });

describe('payslipService', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('fetchPayslips', () => {
    it('fetches all payslips without filters', async () => {
      const promise = fetchPayslips({});
      jest.advanceTimersByTime(100);
      const payslips = await promise;

      expect(payslips).toHaveLength(4);
      expect(payslips[0]).toHaveProperty('id');
      expect(payslips[0]).toHaveProperty('file');
    });

    it('sorts payslips by newest first (default)', async () => {
      const promise = fetchPayslips({ sortOrder: 'newest' });
      jest.advanceTimersByTime(100);
      const payslips = await promise;

      expect(payslips).toHaveLength(4);
      // Should be sorted newest first (2021 before 2020)
      expect(payslips[0].fromDate).toBe('2021-01-01');
      expect(payslips[1].fromDate).toBe('2020-03-01');
      expect(payslips[2].fromDate).toBe('2020-02-01');
      expect(payslips[3].fromDate).toBe('2020-01-01');
    });

    it('sorts payslips by oldest first', async () => {
      const promise = fetchPayslips({ sortOrder: 'oldest' });
      jest.advanceTimersByTime(100);
      const payslips = await promise;

      expect(payslips).toHaveLength(4);
      // Should be sorted oldest first
      expect(payslips[0].fromDate).toBe('2020-01-01');
      expect(payslips[1].fromDate).toBe('2020-02-01');
      expect(payslips[2].fromDate).toBe('2020-03-01');
      expect(payslips[3].fromDate).toBe('2021-01-01');
    });

    it('filters payslips by year', async () => {
      const promise = fetchPayslips({ year: 2020 });
      jest.advanceTimersByTime(100);
      const payslips = await promise;

      expect(payslips).toHaveLength(3);
      payslips.forEach((payslip) => {
        expect(new Date(payslip.fromDate).getFullYear()).toBe(2020);
      });
    });

    it('filters payslips by year (2021)', async () => {
      const promise = fetchPayslips({ year: 2021 });
      jest.advanceTimersByTime(100);
      const payslips = await promise;

      expect(payslips).toHaveLength(1);
      expect(new Date(payslips[0].fromDate).getFullYear()).toBe(2021);
    });

    it('returns empty array when year filter has no matches', async () => {
      const promise = fetchPayslips({ year: 2019 });
      jest.advanceTimersByTime(100);
      const payslips = await promise;

      expect(payslips).toHaveLength(0);
    });

    it('filters payslips by search text (ID)', async () => {
      const promise = fetchPayslips({ searchText: '1' });
      jest.advanceTimersByTime(100);
      const payslips = await promise;

      expect(payslips.length).toBeGreaterThan(0);
      // Should include payslip with id '1'
      expect(payslips.some((p) => p.id === '1')).toBe(true);
    });

    it('filters payslips by search text (year)', async () => {
      const promise = fetchPayslips({ searchText: '2021' });
      jest.advanceTimersByTime(100);
      const payslips = await promise;

      expect(payslips).toHaveLength(1);
      expect(payslips[0].id).toBe('4');
    });

    it('filters payslips by search text (case insensitive)', async () => {
      const promise = fetchPayslips({ searchText: 'JAN' });
      jest.advanceTimersByTime(100);
      const payslips = await promise;

      expect(payslips.length).toBeGreaterThan(0);
    });

    it('combines filters correctly', async () => {
      const promise = fetchPayslips({
        year: 2020,
        sortOrder: 'oldest',
        searchText: 'Jan',
      });
      jest.advanceTimersByTime(100);
      const payslips = await promise;

      // Should filter by year 2020, search for "Jan", and sort oldest first
      expect(payslips.length).toBeGreaterThan(0);
      payslips.forEach((payslip) => {
        expect(new Date(payslip.fromDate).getFullYear()).toBe(2020);
      });
    });

    it('handles empty search text', async () => {
      const promise = fetchPayslips({ searchText: '' });
      jest.advanceTimersByTime(100);
      const payslips = await promise;

      expect(payslips).toHaveLength(4);
    });

    it('handles whitespace-only search text', async () => {
      const promise = fetchPayslips({ searchText: '   ' });
      jest.advanceTimersByTime(100);
      const payslips = await promise;

      expect(payslips).toHaveLength(4);
    });
  });

  describe('fetchPayslipById', () => {
    it('fetches a payslip by ID', async () => {
      const payslip = await fetchPayslipById('1');

      expect(payslip).toBeDefined();
      expect(payslip?.id).toBe('1');
      expect(payslip?.fromDate).toBe('2020-01-01');
      expect(payslip?.toDate).toBe('2020-01-31');
      expect(payslip).toHaveProperty('file');
    });

    it('returns undefined for non-existent ID', async () => {
      const payslip = await fetchPayslipById('999');

      expect(payslip).toBeUndefined();
    });

    it('fetches different payslip by ID', async () => {
      const payslip = await fetchPayslipById('3');

      expect(payslip).toBeDefined();
      expect(payslip?.id).toBe('3');
      expect(payslip?.fromDate).toBe('2020-03-01');
    });
  });

  describe('getAvailableYears', () => {
    it('returns all available years', async () => {
      const promise = getAvailableYears();
      jest.advanceTimersByTime(200); // Need 200ms because getAvailableYears calls fetchPayslips (100ms) + internal processing
      const years = await promise;

      expect(years).toContain(2020);
      expect(years).toContain(2021);
      expect(years.length).toBeGreaterThan(0);
    });

    it('returns years sorted descending (newest first)', async () => {
      const promise = getAvailableYears();
      jest.advanceTimersByTime(200);
      const years = await promise;

      expect(years[0]).toBeGreaterThanOrEqual(years[years.length - 1]);
      // Should be sorted descending
      for (let i = 0; i < years.length - 1; i++) {
        expect(years[i]).toBeGreaterThanOrEqual(years[i + 1]);
      }
    });

    it('returns unique years only', async () => {
      const promise = getAvailableYears();
      jest.advanceTimersByTime(200);
      const years = await promise;
      const uniqueYears = new Set(years);

      expect(years.length).toBe(uniqueYears.size);
    });
  });
});

