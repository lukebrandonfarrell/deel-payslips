/**
 * Asset type from require() in React Native/Expo
 * Can be a number (asset ID), string (URI), or object with uri properties
 */
export type AssetSource = 
  | number // Asset ID/module ID from require()
  | string // URI string
  | { uri?: string; localUri?: string } // Object with URI properties
  | { uri: string } // Object with required uri
  | { localUri: string }; // Object with required localUri

export interface PayslipData {
  id: string;
  fromDate: string; // ISO 8601 date string
  toDate: string; // ISO 8601 date string
  filePath: string; // Path to the asset file
  fileType: 'pdf' | 'image';
}

export interface Payslip extends PayslipData {
  file: AssetSource; // Resolved asset require() result
}

export type SortOrder = 'newest' | 'oldest';

export interface PayslipFilters {
  sortOrder?: SortOrder;
  year?: number | null;
  searchText?: string;
}
