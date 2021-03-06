import { Block } from '../../lib/trips';
import { hoursMinutes, withCommas } from '../../util/formatter';

interface Props {
	blocks: Block[];
}

export default function FlightsData({ blocks }: Props) {
	let blockMin = blocks[0];
	let blockMax = blocks[0];

	// Find the Blocks with least (non-0) and most mileage
	blocks.forEach((block: Block) => {
		const { mileage } = block;

		if (mileage > 0 && mileage < blockMin.mileage) blockMin = block;
		if (mileage > blockMax.mileage) blockMax = block;
	});

	return (
		<table className="table-auto text-center text-white">
			<thead>
				<tr>
					<th />
					<th>Departure</th>
					<th>Arrival</th>
					<th>Distance</th>
					<th>Block Time</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th>Shortest Flight</th>
					<td>{blockMin.startAirport}</td>
					<td>{blockMin.endAirport}</td>
					<td>{withCommas(blockMin.mileage)}</td>
					<td>{hoursMinutes(blockMin.duration)}</td>
				</tr>

				<tr>
					<th>Longest Flight</th>
					<td>{blockMax.startAirport}</td>
					<td>{blockMax.endAirport}</td>
					<td>{withCommas(blockMax.mileage)}</td>
					<td>{hoursMinutes(blockMax.duration)}</td>
				</tr>
			</tbody>
		</table>
	);
}
