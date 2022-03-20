import { Fragment } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import classNames from 'classnames';
import { Trip, Block, getTrips } from '../lib/trips';

export const getServerSideProps: GetServerSideProps = async () => {
	const trips = await getTrips();
	return { props: { trips } };
};

export default function Rotations({ trips }) {
	trips.forEach((trip: Trip) => {
		let prevDate = trip.blocks[0].date;

		for (let i = 1; i < trip.blocks.length; i++) {
			if (trip.blocks[i].date === prevDate) {
				trip.blocks[i].date = '';
			} else {
				prevDate = trip.blocks[i].date;
			}
		}
	});

	return (
		<div className="flex h-screen flex-col items-center gap-2 p-4">
			<Head>
				<title>Flight Log</title>
				<meta name="description" content="Next.js App" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className="bold text-2xl text-white">List of Rotations</h1>

			<div
				id="rotations-table"
				className="h-full w-max max-w-full overflow-scroll rounded-md border-2 border-black"
			>
				<table className="relative -inset-[1px] table border-0 text-center">
					<thead>
						<tr className="bg-gray-200">
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
						{trips.map((trip: Trip, index: number) => (
							<Fragment key={trip.tripNumber}>
								<tr
									className={classNames(
										'border-t-2 border-black',
										index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-200'
									)}
								>
									<td rowSpan={trip.blocks.length}>{trip.tripNumber}</td>
									<td rowSpan={trip.blocks.length}>{trip.rotation}</td>
									<td rowSpan={trip.blocks.length}>{trip.tripLength}</td>

									<BlockCols block={trip.blocks[0]} />

									<td rowSpan={trip.blocks.length}>{trip.creditValue}</td>
									<td rowSpan={trip.blocks.length}>{trip.timeAwayFromBase}</td>
								</tr>

								{trip.blocks.slice(1).map((block: Block, i: number) => (
									<tr
										key={`${trip.tripNumber}-${i}`}
										className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-200'}
									>
										<BlockCols block={block} />
									</tr>
								))}
							</Fragment>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function BlockCols({ block }: { block: Block }) {
	return (
		<>
			<td>{block.date.slice(0, 10)}</td>
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
