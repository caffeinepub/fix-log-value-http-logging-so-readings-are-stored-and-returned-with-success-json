/**
 * Format a numeric value for display, supporting both decimal numbers and bigint
 */
export function formatValue(value: number | bigint): string {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  // For decimal numbers, format with up to 2 decimal places, removing trailing zeros
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/**
 * Convert bigint nanosecond timestamp to readable date/time string
 */
export function formatTimestamp(timestamp: bigint): string {
  // Convert nanoseconds to milliseconds
  const milliseconds = Number(timestamp / 1_000_000n);
  const date = new Date(milliseconds);
  
  // Format as readable English date/time
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}
