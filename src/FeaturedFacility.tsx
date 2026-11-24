import type { Facility } from '../shared/facilities';
import type { HistoryResponse } from '../shared/history';
import type { WomensHoursPeriod } from '../shared/womens-hours';
import { HistoryDetails } from './History';
import { OccupancySummary } from './OccupancySummary';
import { PopularTimes } from './PopularTimes';

type FeaturedFacilityProps = {
  facility: Facility;
  percentage: number | null;
  loading: boolean;
  womensHours: WomensHoursPeriod | null;
  history: HistoryResponse | null;
  historyError: string | null;
  livePercentage: number | null;
};

export function FeaturedFacility({
  facility,
  percentage,
  loading,
  womensHours,
  history,
  historyError,
  livePercentage,
}: FeaturedFacilityProps) {
  return (
    <li className="featured-facility">
      <OccupancySummary
        name={facility.name}
        percentage={percentage}
        loading={loading}
        womensHours={womensHours}
      />
      <div className="featured-suggestion">
        <HistoryDetails
          id={facility.id}
          mode="now"
          data={history}
          error={historyError}
          livePercentage={livePercentage}
        />
      </div>
      <PopularTimes facilityName={facility.name} data={history} facilityId={facility.id} />
    </li>
  );
}
