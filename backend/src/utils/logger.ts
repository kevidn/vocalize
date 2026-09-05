/* eslint-disable no-console */

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';

const COLORS: Record<LogLevel, string> = {
  info: '\x1b[36m',    // Cyan
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  debug: '\x1b[35m',   // Magenta
  success: '\x1b[32m', // Green
};
const RESET = '\x1b[0m';
const DIM = '\x1b[2m';

function formatTimestamp(): string {
  return new Date().toISOString();
}

function log(level: LogLevel, message: string, meta?: unknown): void {
  const color = COLORS[level];
  const prefix = `${color}[${level.toUpperCase().padEnd(7)}]${RESET}`;
  const timestamp = `${DIM}${formatTimestamp()}${RESET}`;

  if (meta !== undefined) {
    console.log(`${timestamp} ${prefix} ${message}`, meta);
  } else {
    console.log(`${timestamp} ${prefix} ${message}`);
  }
}

export const logger = {
  info: (msg: string, meta?: unknown) => log('info', msg, meta),
  warn: (msg: string, meta?: unknown) => log('warn', msg, meta),
  error: (msg: string, meta?: unknown) => log('error', msg, meta),
  debug: (msg: string, meta?: unknown) => {
    if (process.env.NODE_ENV === 'development') log('debug', msg, meta);
  },
  success: (msg: string, meta?: unknown) => log('success', msg, meta),
};
