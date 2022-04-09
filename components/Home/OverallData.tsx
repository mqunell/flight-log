import { Block, Trip } from '../../lib/trips';
import { daysHoursMinutesText, hoursMinutes, withCommas } from '../../util/formatter';

interface Props {
	trips: Trip[];
	blocks: Block[];
}

export default function OverallData({ trips, blocks }: Props) {
	// Calculate total values across all trips/blocks
	const totals = {
		trips: trips.length,
		blocks: blocks.length,
		daysFlown: new Set(blocks.map((block) => block.date)).size,
		mileage: blocks.reduce((acc, block) => acc + block.mileage, 0),
		duration: blocks.reduce((acc, block) => acc + block.duration, 0),
		creditValue: trips.reduce((acc, trip) => acc + trip.creditValue, 0),
		timeAwayFromBase: trips.reduce((acc, trip) => acc + trip.timeAwayFromBase, 0),
		aircraft: {
			airbus: blocks.filter((block) => block.aircraft.make === 'A').length,
			boeing: blocks.filter((block) => block.aircraft.make === 'B').length,
			other: blocks.filter((block) => block.aircraft.make === 'O').length,
			narrow: blocks.filter((block) => block.aircraft.body === 'N').length,
			wide: blocks.filter((block) => block.aircraft.body === 'W').length,
		},
	};

	const doubleValue = (minutes: number) => (
		<span>
			{hoursMinutes(minutes)}
			<br />
			<span className="font-normal">({daysHoursMinutesText(minutes)})</span>
		</span>
	);

	return (
		<div className="grid grid-cols-2 gap-x-4 gap-y-1 text-white">
			<OverallRow label="Trips" value={totals.trips} />
			<OverallRow label="Blocks" value={totals.blocks} />
			<OverallRow label="Days flown" value={totals.daysFlown} />
			<OverallRow label="Miles" value={withCommas(totals.mileage)} />
			<OverallRow label="Block time" value={doubleValue(totals.duration)} />
			<OverallRow label="Credit value" value={doubleValue(totals.creditValue)} />
			<OverallRow label="Time away" value={doubleValue(totals.timeAwayFromBase)} />
			<OverallRow label="Airbus" value={totals.aircraft.airbus} />
			<OverallRow label="Boeing" value={totals.aircraft.boeing} />
			<OverallRow label="Other" value={totals.aircraft.other} />
			<OverallRow label="Narrowbody" value={totals.aircraft.narrow} />
			<OverallRow label="Widebody" value={totals.aircraft.wide} />
		</div>
	);
}

function OverallRow({ label, value }) {
	return (
		<>
			<p className="text-right">{label}</p>
			<p className="font-bold">{value}</p>
		</>
	);
}
