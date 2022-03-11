import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Trip, Block, getTrips } from '../lib/trips';

export const getServerSideProps: GetServerSideProps = async () => {
	const trips = await getTrips();
	return { props: { trips } };
};

export default function Home({ trips }) {
	trips.forEach((trip: Trip) => {
		let prevDate = trip.blocks[0].date;

		for (let i = 1; i < trip.blocks.length; i++) {
			if (trip.blocks[i].date === prevDate) {
				trip.blocks[i].date = null;
			} else {
				prevDate = trip.blocks[i].date;
			}
		}
	});

	return (
		<div className="flex flex-col gap-2 p-8">
			<Head>
				<title>Flight Log</title>
				<meta name="description" content="Next.js App" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<table className="w-max table-auto border-collapse border border-gray-500 text-center">
				<thead>
					<tr>
						<th>Trip Number</th>
						<th>Rotation</th>
						<th>Trip Length</th>
						<th>Date</th>
						<th>Start</th>
						<th>End</th>
						<th>Duration</th>
						<th>Mileage</th>
						<th>Layover</th>
						<th>Letter</th>
						<th>Number</th>
						<th>Body</th>
						<th>Flight Number</th>
						<th>Credit Value</th>
						<th>Time Away</th>
					</tr>
				</thead>
				<tbody>
					{trips.map((trip: Trip) => (
						<>
							<tr key={trip.tripNumber}>
								<td rowSpan={trip.blocks.length}>{trip.tripNumber}</td>
								<td rowSpan={trip.blocks.length}>{trip.rotation}</td>
								<td rowSpan={trip.blocks.length}>{trip.tripLength}</td>

								<BlockCols block={trip.blocks[0]} />

								<td rowSpan={trip.blocks.length}>{trip.creditValue}</td>
								<td rowSpan={trip.blocks.length}>{trip.timeAwayFromBase}</td>
							</tr>

							{trip.blocks.slice(1).map((block: Block, i: number) => (
								<tr key={`${trip.tripNumber}-${i}`}>
									<BlockCols block={block} />
								</tr>
							))}
						</>
					))}
				</tbody>
			</table>
		</div>
	);
}

function BlockCols({ block }: { block: Block }) {
	return (
		<>
			<td>{block.date && block.date.toString().slice(0, 10)}</td>
			<td>{block.startAirport}</td>
			<td>{block.endAirport}</td>
			<td>{block.duration}</td>
			<td>{block.mileage}</td>
			<td>{block.layover && block.endAirport}</td>
			<td>{block.aircraftLetter}</td>
			<td>{block.aircraftNumber}</td>
			<td>{block.aircraftBody}</td>
			<td>{block.flightNumber}</td>
		</>
	);
}
