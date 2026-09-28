import type { Facility } from '../shared/facilities';
import type { HistoryResponse } from '../shared/history';
import { HistoryDetails } from './History';
import { OccupancySummary } from './OccupancySummary';

type FeaturedFacilityProps = {
  facility: Facility;
  percentage: number | null;
  loading: boolean;
  womensHours: boolean;
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
    </li>
  );
}
