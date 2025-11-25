/**
 * Formats ISO date string to readable format
 * @param date ISO 8601 date string
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a date range for payslip period display
 * @param fromDate Start date in ISO format
 * @param toDate End date in ISO format
 * @returns Formatted range string (e.g., "Jan 01 - Jan 31, 2024")
 */
export function formatDateRange(fromDate: string, toDate: string): string {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  
  const fromMonth = from.toLocaleDateString('en-US', { month: 'short' });
  const fromDay = from.getDate().toString().padStart(2, '0');
  
  const toMonth = to.toLocaleDateString('en-US', { month: 'short' });
  const toDay = to.getDate().toString().padStart(2, '0');
  const year = to.getFullYear();
  
  // If same month, show: "Jan 01 - 31, 2024"
  if (fromMonth === toMonth && from.getFullYear() === to.getFullYear()) {
    return `${fromMonth} ${fromDay} - ${toDay}, ${year}`;
  }
  
  // If same year: "Jan 01 - Feb 28, 2024"
  if (from.getFullYear() === to.getFullYear()) {
    return `${fromMonth} ${fromDay} - ${toMonth} ${toDay}, ${year}`;
  }
  
  // Different years: "Dec 15, 2023 - Jan 15, 2024"
  return `${fromMonth} ${fromDay}, ${from.getFullYear()} - ${toMonth} ${toDay}, ${year}`;
}

/**
 * Gets year from ISO date string
 * @param date ISO 8601 date string
 * @returns Year as number
 */
export function getYear(date: string): number {
  return new Date(date).getFullYear();
}

