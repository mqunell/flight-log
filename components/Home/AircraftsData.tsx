import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import { AircraftMake, Block } from '../../lib/trips';
import { hoursMinutes, withCommas } from '../../util/formatter';

interface Props {
	blocks: Block[];
}

interface AircraftData {
	make: AircraftMake;
	model: string;
	count: number;
	duration: number;
	mileage: number;
}

interface ChartData {
	title: 'Airbus' | 'Boeing' | 'Other';
	[key: string]: any; // ex. { 'A220': 15 }
}

interface TooltipProps {
	active: boolean;
	payload: Payload[];
	label: string;
}

interface Payload {
	color: string; // Hex code
	dataKey: string;
	payload: ChartData;
	value: number;
	// chartType, fill, formatter, type, unit, etc
}

const colors = ['#15550d', '#18740f', '#19950f', '#18b70e', '#12db09', '#00ff00'];

/**
 * Displays data about the aircrafts that have been flown on. This component aggregates and formats
 * data from all of the Blocks, then passes it to the AircraftsChart component.
 */
export default function AircraftsData({ blocks }: Props) {
	// Aggregate aircraft data by make and model
	const aircraftData: AircraftData[] = [];

	blocks.forEach(({ aircraft, duration, mileage }: Block) => {
		const { make, model } = aircraft;

		const dataItem: AircraftData = aircraftData.find(
			(item) => item.make === make && item.model === model
		);

		// Initialize the item if it isn't found
		if (!dataItem) {
			aircraftData.push({ make, model, count: 1, duration, mileage });
			return;
		}

		// Update the values if the item is found
		dataItem.count += 1;
		dataItem.duration += duration;
		dataItem.mileage += mileage;
	});

	// Sort by make then model
	aircraftData.sort((a, b) => {
		if (a.make !== b.make) return a.make < b.make ? -1 : 1;
		return a.model < b.model ? -1 : 1;
	});

	return (
		<div className="w-full max-w-[600px] rounded-xl bg-white p-4">
			<h1 className="mb-2 text-center text-lg font-bold">Aircrafts</h1>

			<AircraftsChart aircraftData={aircraftData} />

			<table className="mx-auto mt-4 table-auto text-center text-sm lg:text-base">
				<thead>
					<tr>
						<th>Aircraft</th>
						{/* <th>Number Flown</th> */}
						<th>Time Flown</th>
						<th>Miles Flown</th>
					</tr>
				</thead>
				<tbody>
					{aircraftData.map(({ make, model, count, duration, mileage }: AircraftData) => (
						<tr key={`${make}${model}`}>
							<th>{`${make}${model}`}</th>
							{/* <td>{count}</td> */}
							<td>{hoursMinutes(duration)}</td>
							<td>{withCommas(mileage)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

/**
 * Chart notes:
 * Stacked bar charts typically don't use bar sections that are unique to their columns, so this
 * implementation is a bit hacky. A <Bar> component is created for every aircraft model, meaning
 * all columns technically have the other columns' models as well, but nothing gets rendered where
 * it shouldn't because the keys/values for each column only include that make's models.
 *
 * For example, the Airbus column is capable of making a bar section for the B737 because a <Bar>
 * component for the B737 is created (which belongs to all columns). However, the object with
 * { title: 'Airbus' } doesn't contain a key of 'B737', so it doesn't get shown in that column.
 */
function AircraftsChart({ aircraftData }: { aircraftData: AircraftData[] }) {
	// Format aircraftData specificy for for the BarChart
	const chartData: ChartData[] = ['Airbus', 'Boeing', 'Other'].map((title) => {
		const chartObject = { title };

		aircraftData.forEach(({ make, model, count }: AircraftData) => {
			if (make === title.charAt(0)) chartObject[make + model] = count;
		});

		return chartObject as ChartData;
	});

	return (
		<ResponsiveContainer width="100%" height={250}>
			<BarChart data={chartData}>
				<CartesianGrid />
				<XAxis dataKey="title" height={20} />
				<YAxis width={30} />
				<Tooltip content={<CustomTooltip /* props passed internally */ />} />

				{chartData.map((chartItem: ChartData) =>
					Object.keys(chartItem)
						.filter((key) => key !== 'title')
						.sort((a, b) => (a < b ? 1 : -1))
						.map((makeModel, index) => (
							<Bar key={makeModel} dataKey={makeModel} stackId="a" fill={colors[index]} />
						))
				)}
			</BarChart>
		</ResponsiveContainer>
	);
}

// "any" included as props type to prevent an ESLint error from the props being passed internally
function CustomTooltip({ active, payload, label }: TooltipProps | any) {
	if (!(active && payload && payload.length)) return null;

	return (
		<div className="flex flex-col gap-1 rounded-md bg-white py-2 px-3 shadow-md">
			<p className="text-center font-bold">{label}</p>

			{payload
				.sort((a: Payload, b: Payload) => (a.dataKey < b.dataKey ? -1 : 1))
				.map(({ dataKey, color, value }) => (
					<p key={dataKey} style={{ color }} className="grid grid-cols-[auto_1fr] gap-2">
						<span>{dataKey}:</span>
						<span className="text-right italic">
							{value} flight{value !== 1 && 's'}
						</span>
					</p>
				))}
		</div>
	);
}
