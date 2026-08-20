/**
 * Utilities for parsing human-friendly dates and checking overdue status.
 */

/**
 * Formats a Date object to YYYY-MM-DD string.
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses natural language or formatted date strings.
 * Supports:
 *  - "today" / "tod"
 *  - "tomorrow" / "tmrw" / "tom"
 *  - "yesterday"
 *  - "+Nd" / "+N" (e.g., "+3d", "+7")
 *  - "YYYY-MM-DD" or standard date strings
 * @param {string|null|undefined} input
 * @returns {string|null} YYYY-MM-DD or null if invalid/empty
 */
export function parseHumanDate(input) {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const str = input.trim().toLowerCase();
  if (!str) return null;

  const now = new Date();

  if (str === 'today' || str === 'tod') {
    return formatDate(now);
  }

  if (str === 'tomorrow' || str === 'tmrw' || str === 'tom') {
    const tmrw = new Date(now);
    tmrw.setDate(now.getDate() + 1);
    return formatDate(tmrw);
  }

  if (str === 'yesterday') {
    const yest = new Date(now);
    yest.setDate(now.getDate() - 1);
    return formatDate(yest);
  }

  // Matches "+3d", "+5", "+10days"
  const relativeMatch = str.match(/^\+(\d+)\s*(d|days|day)?$/);
  if (relativeMatch) {
    const daysToAdd = parseInt(relativeMatch[1], 10);
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + daysToAdd);
    return formatDate(futureDate);
  }

  // Exact YYYY-MM-DD format check
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const parsed = new Date(str + 'T00:00:00');
    if (!isNaN(parsed.getTime())) {
      return formatDate(parsed);
    }
  }

  // Fallback generic Date parse
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return formatDate(parsed);
  }

  return null;
}

/**
 * Checks if a given date string is overdue compared to today.
 * @param {string|null|undefined} dateString
 * @param {Date} [referenceDate=new Date()]
 * @returns {boolean}
 */
export function isDateOverdue(dateString, referenceDate = new Date()) {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }

  const parsed = parseHumanDate(dateString);
  if (!parsed) return false;

  const todayStr = formatDate(referenceDate);
  return parsed < todayStr;
}
