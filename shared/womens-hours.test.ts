import { expect, it } from 'vitest';
import { womensHoursAt } from './womens-hours';
import { localInstant } from './history';

it.each([
  ['2026-09-21', 630], ['2026-09-22', 840], ['2026-09-23', 630],
  ['2026-09-24', 840], ['2026-09-25', 630], ['2026-09-26', 840], ['2026-09-27', 630],
])('shows the posted RAC Fitness Centre interval on %s, including start and excluding end', (date, start) => {
  expect(womensHoursAt('rac-fitness', localInstant(date, start - 1))).toBeNull();
  expect(womensHoursAt('rac-fitness', localInstant(date, start))).toEqual({ start, end: start + 90 });
  expect(womensHoursAt('rac-fitness', localInstant(date, start + 89))).toEqual({ start, end: start + 90 });
  expect(womensHoursAt('rac-fitness', localInstant(date, start + 90))).toBeNull();
});

it('does not apply the fitness-centre period to other RAC spaces or MAC', () => {
  const at = localInstant('2026-09-25', 660);
  for (const id of ['rac-1', 'rac-2', 'rac-circuit', 'rac-functional', 'mac-fitness']) {
    expect(womensHoursAt(id, at)).toBeNull();
  }
});

it('uses Toronto time in winter and excludes closed or holiday dates', () => {
  expect(womensHoursAt('rac-fitness', new Date('2026-12-07T15:30:00Z'))).toEqual({ start: 630, end: 720 });
  expect(womensHoursAt('rac-fitness', new Date('2026-12-07T15:29:00Z'))).toBeNull();
  expect(womensHoursAt('rac-fitness', localInstant('2026-10-12', 660))).toBeNull();
  expect(womensHoursAt('rac-fitness', new Date('invalid'))).toBeNull();
});
