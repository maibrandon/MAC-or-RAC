import { collectionWindow, torontoParts } from './schedule';

export type WomensHoursPeriod = { start: number; end: number };

// TMU posts this recurring period for RAC Fitness Centre & Track. The track is
// not a listed occupancy space, and other RAC rooms have separate programming.
export function womensHoursAt(facilityId: string, at: Date): WomensHoursPeriod | null {
  if (facilityId !== 'rac-fitness' || !Number.isFinite(at.getTime()) || collectionWindow(at).state !== 'open') return null;
  const { weekday, minute } = torontoParts(at);
  const start = [0, 1, 3, 5].includes(weekday) ? 10 * 60 + 30 : 14 * 60;
  const end = start + 90;
  return minute >= start && minute < end ? { start, end } : null;
}
