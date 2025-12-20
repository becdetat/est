/**
 * Calculate the date that is a specific number of days ago from now
 * @param days - Number of days to go back
 * @returns Date object representing the past date
 */
export function getDaysAgo(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

/**
 * Check if a date is older than a specified number of days
 * @param date - Date to check
 * @param days - Number of days to compare against
 * @returns True if date is older than specified days
 */
export function isOlderThan(date: Date, days: number): boolean {
    const cutoffDate = getDaysAgo(days);
    return date < cutoffDate;
}

/**
 * Format a date for logging purposes
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateForLog(date: Date): string {
    return date.toISOString();
}

/**
 * Get the age of a date in days
 * @param date - Date to calculate age for
 * @returns Number of days since the date
 */
export function getAgeInDays(date: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
