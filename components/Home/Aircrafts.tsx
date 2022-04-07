import { Block } from '../../lib/trips';

interface Props {
	blocks: Block[];
}

interface AircraftData {
	make: 'A' | 'B' | 'O';
	model: string;
	count: number;
	duration: number;
	mileage: number;
}

export default function Aircrafts({ blocks }: Props) {
	const data: AircraftData[] = [];

	// Aggregate aircraft data by make and model
	blocks.forEach(({ aircraft, duration, mileage }: Block) => {
		const { make, model } = aircraft;

		const dataItem = data.find((item) => item.make === make && item.model === model);

		if (!dataItem) {
			data.push({ make, model, count: 1, duration, mileage });
			return;
		}

		dataItem.count += 1;
		dataItem.duration += duration;
		dataItem.mileage += mileage;
	});

	// Sort aircraft data by make then model
	data.sort((a, b) => {
		if (a.make !== b.make) return a.make < b.make ? -1 : 1;
		return a.model < b.model ? -1 : 1;
	});

	return (
		<table className="table-auto text-center text-white">
			<thead>
				<tr>
					<th>Aircraft</th>
					<th>Number Flown</th>
					<th>Time Flown</th>
					<th>Miles Flown</th>
				</tr>
			</thead>
			<tbody>
				{data.map(({ make, model, count, duration, mileage }: AircraftData) => (
					<tr key={`${make}${model}`}>
						<td>{`${make}${model}`}</td>
						<td>{count}</td>
						<td>{duration}</td>
						<td>{mileage}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
