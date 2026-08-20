/**
 * ANSI Color escape codes for formatted console output.
 */
export const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',

  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  // Bright colors
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightCyan: '\x1b[96m',
  brightMagenta: '\x1b[95m'
};

/**
 * Returns colored text for specific status values.
 * @param {string} [status]
 * @param {boolean} [useColors=true]
 * @returns {string}
 */
export function getStatusBadge(status, useColors = true) {
  const norm = (status || '').toLowerCase().replace(/-/g, '_');

  if (!useColors) {
    switch (norm) {
      case 'completed':
        return '✓ [Completed]';
      case 'in_progress':
        return '⏳ [In Progress]';
      case 'pending':
        return '○ [Pending]';
      default:
        return `[${norm || 'Unknown'}]`;
    }
  }

  switch (norm) {
    case 'completed':
      return `${colors.green}${colors.bold}✓ [Completed]${colors.reset}`;
    case 'in_progress':
      return `${colors.yellow}${colors.bold}⏳ [In Progress]${colors.reset}`;
    case 'pending':
      return `${colors.cyan}${colors.bold}○ [Pending]${colors.reset}`;
    default:
      return `${colors.gray}${colors.bold}[${norm || 'Unknown'}]${colors.reset}`;
  }
}

/**
 * Returns colored badge for task priority.
 * @param {string} [priority='medium']
 * @param {boolean} [useColors=true]
 * @returns {string}
 */
export function getPriorityBadge(priority = 'medium', useColors = true) {
  const norm = (priority || '').toLowerCase();

  if (!useColors) {
    switch (norm) {
      case 'high':
        return '[HIGH]';
      case 'low':
        return '[LOW]';
      default:
        return '[MED]';
    }
  }

  switch (norm) {
    case 'high':
      return `${colors.red}${colors.bold}[HIGH]${colors.reset}`;
    case 'low':
      return `${colors.blue}${colors.bold}[LOW]${colors.reset}`;
    default:
      return `${colors.yellow}${colors.bold}[MED]${colors.reset}`;
  }
}

/**
 * Returns overdue warning indicator.
 * @param {boolean} [useColors=true]
 * @returns {string}
 */
export function getOverdueBadge(useColors = true) {
  if (!useColors) return '⚠️ [OVERDUE]';
  return `${colors.brightRed}${colors.bold}⚠️ [OVERDUE]${colors.reset}`;
}
