import { z } from 'zod';
import '../docs/openapi';

/**
 * Transaction-date convention (spec §6):
 * a transaction date is a calendar date chosen by the user ("2026-11-03"), stored as that day's
 * 00:00:00.000Z. It is never shifted by time zone, so a transaction always belongs to the same day,
 * month and report regardless of where it is viewed or whether the user later changes time zone.
 * The user's time zone is only used to work out what "today" is. createdAt/updatedAt are real
 * UTC timestamps.
 */

const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseCalendarDate(value: string): Date | null {
  const match = CALENDAR_DATE.exec(value);
  if (!match) return null;
  const [, y, m, d] = match.map(Number) as [number, number, number, number];
  const date = new Date(Date.UTC(y, m - 1, d));
  // Rejects impossible dates such as 2026-02-30, which Date.UTC would roll over.
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d ? date : null;
}

export function formatCalendarDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Today's calendar date in the given IANA time zone, e.g. "2026-11-03". */
export function todayIn(timeZone: string): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date(),
  );
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export const calendarDateSchema = z
  .string()
  .refine((value) => parseCalendarDate(value) !== null, 'Use a valid date in YYYY-MM-DD format')
  .openapi({ example: '2026-11-03', format: 'date' });
