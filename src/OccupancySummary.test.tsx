import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { OccupancySummary } from './OccupancySummary';
it('distinguishes a supported zero from unavailable and loading readings',()=>{
 const render=(percentage:number|null,loading=false)=>renderToStaticMarkup(<OccupancySummary name="MAC" percentage={percentage} loading={loading}/>);
 expect(render(0)).toContain('aria-valuenow="0"');
 expect(render(null)).not.toContain('role="meter"');
 expect(render(null)).toContain('Unavailable');
 expect(render(null,true)).toContain('Checking');
});
it('keeps the bar and status aligned at both color boundaries',()=>{
 for(const [percentage,level] of [[34,'low'],[35,'moderate'],[64,'moderate'],[65,'high']] as const){
  const html=renderToStaticMarkup(<OccupancySummary name="MAC" percentage={percentage}/>);
  expect(html.match(new RegExp(`data-level="${level}"`,'g'))).toHaveLength(2);
  expect(html).toContain(`aria-valuenow="${percentage}"`);
 }
});

it('separates the active schedule notice from the occupancy status', () => {
 const period = { start: 630, end: 720 };
 const live = renderToStaticMarkup(<OccupancySummary name="RAC Fitness Centre" percentage={20} womensHours={period}/>);
 expect(live).toContain('womens-hours-notice');
 expect(live).toContain('Women’s hours now · 10:30 AM–12:00 PM');
 expect(live).toContain('Quiet');
 expect(live).toContain('aria-valuenow="20"');
 const future = renderToStaticMarkup(<OccupancySummary name="RAC Fitness Centre" percentage={20} womensHours={{ start: 840, end: 930 }} womensHoursMode="later"/>);
 expect(future).toContain('Women’s hours · 2:00 PM–3:30 PM');
 expect(future).not.toContain('Women’s hours now');
 expect(renderToStaticMarkup(<OccupancySummary name="MAC" percentage={20}/>)).not.toContain('womens-hours-notice');
});
