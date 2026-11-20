export const SOURCE_URL = 'https://recportal.torontomu.ca/FacilityOccupancy';

export const FACILITIES = [
  { id: 'mac-fitness', name: 'MAC Fitness Centre', location: 'MAC' },
  { id: 'rac-fitness', name: 'RAC Fitness Centre', location: 'RAC' },
  { id: 'rac-1', name: 'RAC 1 Gym (LL3)', location: 'RAC' },
  { id: 'rac-2', name: 'RAC II Gym (LL3)', location: 'RAC' },
  { id: 'rac-circuit', name: 'RAC Cardio & Strength Circuit Room', location: 'RAC' },
  { id: 'rac-functional', name: 'RAC Functional Training Room', location: 'RAC' },
] as const;

export type Facility = (typeof FACILITIES)[number];
export type Reading = Facility & { percentage: number | null };

// Source headings are independent of UI labels and persisted D1 facility IDs.
export const SOURCE_NAMES: Record<Facility['id'], string> = {
  'mac-fitness': 'MAC Fitness Centre',
  'rac-fitness': 'Fitness Centre (LL3 - RAC 203)',
  'rac-1': 'RAC GYM 1 (LL3 - RAC 201)',
  'rac-2': 'RAC Gym 2 (LL3 - RAC 202)',
  'rac-circuit': 'Cardio & Strength Circuit Room (LL1 - RAC 114A)',
  'rac-functional': 'Functional Training Room (LL2 - RAC 205B)',
};
