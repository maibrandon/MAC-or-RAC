import type { WomensHoursPeriod } from '../shared/womens-hours';

function timeLabel(minute: number) {
  const hour = Math.floor(minute / 60);
  return `${hour % 12 || 12}:${String(minute % 60).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
}

type OccupancySummaryProps = {
  name: string;
  percentage: number | null;
  loading?: boolean;
  womensHours?: WomensHoursPeriod | null;
  womensHoursMode?: 'now' | 'later';
};

export function OccupancySummary({ name, percentage, loading = false, womensHours = null, womensHoursMode = 'now' }: OccupancySummaryProps) {
  const level = percentage === null ? 'unknown' : percentage < 35 ? 'low' : percentage < 65 ? 'moderate' : 'high';
  return (
    <span className="occupancy-row">
      <span className="facility-name">
        <span>{name}</span>
        {womensHours && (
          <span className="womens-hours-notice">
            Women’s hours{womensHoursMode === 'now' ? ' now' : ''} · {timeLabel(womensHours.start)}–{timeLabel(womensHours.end)}
          </span>
        )}
      </span>
      <span className="row-meter">
        {percentage !== null ? (
          <span
            role="meter"
            className="occupancy-meter"
            data-level={level}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentage}
            aria-label={`${name} occupancy`}
          >
            <span className="occupancy-fill" style={{ width: `${percentage}%` }} aria-hidden="true" />
          </span>
        ) : (
          <span className={`empty-meter ${loading ? 'skeleton' : ''}`} aria-hidden="true" />
        )}
      </span>
      <span className="occupancy-value">
        {loading ? <span className="skeleton h-5 w-10 rounded" aria-label="Loading" /> : percentage === null ? <span className="unavailable-value">—</span> : `${percentage}%`}
      </span>
      <span className="occupancy-status" data-level={level}>
        {percentage === null ? (loading ? 'Checking' : 'Unavailable') : percentage < 35 ? 'Quiet' : percentage < 65 ? 'Not too busy' : 'Busy'}
      </span>
    </span>
  );
}
