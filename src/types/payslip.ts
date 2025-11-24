export interface PayslipData {
  id: string;
  fromDate: string; // ISO 8601 date string
  toDate: string; // ISO 8601 date string
  filePath: string; // Path to the asset file
  fileType: 'pdf' | 'image';
}

export interface Payslip extends PayslipData {
  file: any; // Resolved asset require() result
}

export type SortOrder = 'newest' | 'oldest';
