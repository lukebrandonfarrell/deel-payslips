export const APP_NAME = 'Payslips';

export const ERROR_MESSAGES = {
  DOWNLOAD_FAILED: 'Failed to download payslip. Please try again.',
  PERMISSION_DENIED: 'Permission denied. Please allow file access to download payslips.',
  FILE_NOT_FOUND: 'Payslip file not found.',
  PAYSLIP_NOT_FOUND: 'Payslip not found.',
} as const;

export const SUCCESS_MESSAGES = {
  DOWNLOAD_SUCCESS: 'Payslip downloaded successfully!',
} as const;
