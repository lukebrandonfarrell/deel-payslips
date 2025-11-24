import payslipsData from '../data/payslips.json';
import { Payslip, PayslipData, SortOrder } from '../types/payslip';

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
 * Loads payslips from JSON, resolves file assets, and sorts them
 */
export async function fetchPayslips(sortOrder: SortOrder = 'newest'): Promise<Payslip[]> {
  // Simulate async loading (in real app, this might fetch from API)
  return new Promise((resolve) => {
    setTimeout(() => {
      const payslipsDataArray = (payslipsData as { payslips: PayslipData[] }).payslips;
      
      // Resolve file assets
      const payslips: Payslip[] = payslipsDataArray.map((payslipData) => ({
        ...payslipData,
        file: resolveFileAsset(payslipData.filePath),
      }));
      
      // Sort payslips
      const sortedPayslips = sortPayslips(payslips, sortOrder);
      
      resolve(sortedPayslips);
    }, 100); // Small delay to simulate async
  });
}

/**
 * Fetches a single payslip by ID
 */
export async function fetchPayslipById(id: string): Promise<Payslip | undefined> {
  const payslips = await fetchPayslips('newest'); // Sort order doesn't matter for single item
  return payslips.find((p) => p.id === id);
}

