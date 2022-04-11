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

const colors = ['#15550d', '#18740f', '#19950f', '#18b70e', '#12db09', '#00ff00'];

/**
 *
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
				<Tooltip />

				{chartData.map((chartItem: ChartData) =>
					Object.keys(chartItem)
						.filter((key) => key !== 'title')
						.map((makeModel, index) => (
							<Bar key={makeModel} dataKey={makeModel} stackId="a" fill={colors[index]} />
						))
				)}
			</BarChart>
		</ResponsiveContainer>
	);
}
