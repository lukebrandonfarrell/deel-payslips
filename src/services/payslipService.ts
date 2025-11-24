import payslipsData from '../data/payslips.json';
import { Payslip, PayslipData, PayslipFilters, SortOrder } from '../types/payslip';
import { formatDateRange, getYear } from '../utils/dateFormatter';

// Map file paths to actual assets
const FILE_ASSETS: Record<string, any> = {
  'sample-payslip.pdf': require('../../assets/sample-payslip.pdf'),
  // Add more file mappings here as needed
};

/**
 * Resolves file asset from file path
 */
function resolveFileAsset(filePath: string): any {
  return FILE_ASSETS[filePath] || require('../../assets/sample-payslip.pdf');
}

/**
 * Sorts payslips by date
 */
function sortPayslips(payslips: Payslip[], sortOrder: SortOrder): Payslip[] {
  const sorted = [...payslips];
  sorted.sort((a, b) => {
    const dateA = new Date(a.fromDate).getTime();
    const dateB = new Date(b.fromDate).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
  return sorted;
}

/**
 * Filters payslips by year
 */
function filterByYear(payslips: Payslip[], year: number | null | undefined): Payslip[] {
  if (year === null || year === undefined) {
    return payslips;
  }
  return payslips.filter((payslip) => getYear(payslip.fromDate) === year);
}

/**
 * Filters payslips by search text
 */
function filterBySearchText(payslips: Payslip[], searchText: string | undefined): Payslip[] {
  if (!searchText || !searchText.trim()) {
    return payslips;
  }
  
  const searchLower = searchText.toLowerCase().trim();
  return payslips.filter((payslip) => {
    // Search by ID
    if (payslip.id.toLowerCase().includes(searchLower)) {
      return true;
    }
    // Search by formatted date range
    const dateRange = formatDateRange(payslip.fromDate, payslip.toDate).toLowerCase();
    if (dateRange.includes(searchLower)) {
      return true;
    }
    // Search by year
    const yearStr = getYear(payslip.fromDate).toString();
    if (yearStr.includes(searchLower)) {
      return true;
    }
    return false;
  });
}

/**
 * Loads payslips from JSON, resolves file assets, sorts and filters them
 */
export async function fetchPayslips(filters: PayslipFilters = {}): Promise<Payslip[]> {
  const {
    sortOrder = 'newest',
    year,
    searchText,
  } = filters;

  // Simulate async loading (in real app, this might fetch from API)
  return new Promise((resolve) => {
    setTimeout(() => {
      const payslipsDataArray = (payslipsData as { payslips: PayslipData[] }).payslips;
      
      // Resolve file assets
      let payslips: Payslip[] = payslipsDataArray.map((payslipData) => ({
        ...payslipData,
        file: resolveFileAsset(payslipData.filePath),
      }));
      
      // Apply filters
      payslips = filterByYear(payslips, year);
      payslips = filterBySearchText(payslips, searchText);
      
      // Sort payslips (sorting happens after filtering)
      const sortedPayslips = sortPayslips(payslips, sortOrder);
      
      resolve(sortedPayslips);
    }, 100); // Small delay to simulate async
  });
}

/**
 * Fetches a single payslip by ID
 */
export async function fetchPayslipById(id: string): Promise<Payslip | undefined> {
  const payslips = await fetchPayslips({ sortOrder: 'newest' }); // Sort order doesn't matter for single item
  return payslips.find((p) => p.id === id);
}

/**
 * Gets all available years from payslips
 */
export async function getAvailableYears(): Promise<number[]> {
  const payslips = await fetchPayslips({});
  const years = new Set<number>();
  payslips.forEach((payslip) => {
    years.add(getYear(payslip.fromDate));
  });
  return Array.from(years).sort((a, b) => b - a); // Sort descending (newest first)
}

