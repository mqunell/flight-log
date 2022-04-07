import { Trip } from '../../lib/trips';

interface Props {
	trips: Trip[];
}

interface TripData {
	tripLength: number;
	count: number;
	creditMin: number;
	creditMax: number;
	timeAwayMin: number;
	timeAwayMax: number;
}

export default function TripsData({ trips }: Props) {
	const data: TripData[] = [];

	// Aggregate trip data by tripLength
	trips.forEach(({ tripLength, creditValue, timeAwayFromBase }: Trip) => {
		const dataItem = data.find((item) => item.tripLength === tripLength);

		if (!dataItem) {
			data.push({
				tripLength,
				count: 1,
				creditMin: creditValue,
				creditMax: creditValue,
				timeAwayMin: timeAwayFromBase,
				timeAwayMax: timeAwayFromBase,
			});
			return;
		}

		dataItem.count += 1;
		dataItem.creditMin = Math.min(dataItem.creditMin, creditValue);
		dataItem.creditMax = Math.max(dataItem.creditMax, creditValue);
		dataItem.timeAwayMin = Math.min(dataItem.timeAwayMin, timeAwayFromBase);
		dataItem.timeAwayMax = Math.max(dataItem.timeAwayMax, timeAwayFromBase);
	});

	// Sort trip data by length
	trips.sort((a, b) => a.tripLength - b.tripLength);

	return (
		<table className="table-auto text-center text-white">
			<thead>
				<tr>
					<th>Trip Length</th>
					<th>Number Flown</th>
					<th>Lowest Credit</th>
					<th>Highest Credit</th>
					<th>Shortest TAFB</th>
					<th>Longest TAFB</th>
				</tr>
			</thead>
			<tbody>
				{data.map(
					({
						tripLength,
						count,
						creditMin,
						creditMax,
						timeAwayMin,
						timeAwayMax,
					}: TripData) => (
						<tr key={tripLength}>
							<th>{tripLength}</th>
							<td>{count}</td>
							<td>{creditMin}</td>
							<td>{creditMax}</td>
							<td>{timeAwayMin}</td>
							<td>{timeAwayMax}</td>
						</tr>
					)
				)}
			</tbody>
		</table>
	);
}
