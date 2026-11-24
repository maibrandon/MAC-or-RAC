import { useState, type PointerEvent } from 'react';
import { operatingHours } from '../shared/schedule';
import type { HistoryResponse } from '../shared/history';

const timeLabel = (minute: number) => {
  const hour = Math.floor(minute / 60);
  return `${hour % 12 || 12}${minute % 60 ? `:${String(minute % 60).padStart(2, '0')}` : ''} ${hour < 12 ? 'AM' : 'PM'}`;
};

export function PopularTimes({ facilityId, facilityName, data }: {
  facilityId: string;
  facilityName: string;
  data: HistoryResponse | null;
}) {
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
  const profile = data?.message ? undefined : data?.facilities.find(facility => facility.id === facilityId)?.profile;
  if (!data || !profile?.length) return null;

  const weekday = new Date(`${data.date}T12:00:00Z`).getUTCDay();
  const { open, close } = operatingHours(weekday);
  const minutes = Array.from({ length: Math.ceil((close - open) / 30) }, (_, index) => open + index * 30);
  const values = new Map(profile.map(bucket => [bucket.minute, bucket]));
  const currentIndex = Math.min(minutes.length - 1, Math.max(0, Math.floor((data.minute - open) / 30)));
  const selectedIndex = selectedMinute === null ? currentIndex : Math.max(0, minutes.indexOf(selectedMinute));
  const selected = values.get(minutes[selectedIndex]);

  function selectFromPointer(event: PointerEvent<HTMLInputElement>) {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    setSelectedMinute(minutes[Math.min(minutes.length - 1, Math.floor(progress * minutes.length))]);
  }

  return (
    <div className="popular-times">
      <div className="popular-times-plot">
        {selectedMinute !== null && <div className="popular-times-tooltip" aria-hidden="true">
          {timeLabel(minutes[selectedIndex])} · {selected ? `${selected.percentage}% ${selected.basis === 'weekday' ? 'weekday average' : 'typical'}` : 'No average yet'}
        </div>}
        <div className="popular-times-bars" aria-hidden="true">
          {minutes.map((minute, index) => {
            const bucket = values.get(minute);
            const level = bucket ? bucket.percentage < 35 ? 'low' : bucket.percentage < 65 ? 'moderate' : 'high' : 'missing';
            return <span className="popular-times-bar" data-active={index === selectedIndex} data-level={level} key={minute}>
              <span style={{ height: bucket ? `${Math.max(bucket.percentage, 3)}%` : '2px' }} />
            </span>;
          })}
        </div>
        <input
          className="popular-times-range"
          type="range"
          min="0"
          max={minutes.length - 1}
          value={selectedIndex}
          aria-label={`Explore typical occupancy for ${facilityName}`}
          aria-valuetext={`${timeLabel(minutes[selectedIndex])}: ${selected ? `${selected.percentage}% typical occupancy` : 'no recorded average'}`}
          onChange={event => setSelectedMinute(minutes[Number(event.currentTarget.value)])}
          onPointerMove={selectFromPointer}
          onPointerDown={selectFromPointer}
          onPointerLeave={event => { if (event.pointerType === 'mouse') setSelectedMinute(null); }}
        />
      </div>
      <div className="popular-times-axis" aria-hidden="true">
        <span>{timeLabel(open)}</span><span>{timeLabel(open + Math.floor((close - open) / 60) * 30)}</span><span>{timeLabel(close)}</span>
      </div>
    </div>
  );
}
