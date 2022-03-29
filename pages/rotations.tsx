import { Fragment } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import classNames from 'classnames';
import { Trip, Block, getTrips } from '../lib/trips';

export const getServerSideProps: GetServerSideProps = async () => {
	const trips = await getTrips();

	// Set block dates to '' if they are the same as the previous
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

	return { props: { trips } };
};

// Convert "yyyy-mm-dd" to "mm/dd/yyyy" for displaying
const formatDate = (dateString: string): string => {
	const [y, m, d] = dateString.split('-');

	return `${m.toString().padStart(2, '0')}/${d.toString().padStart(2, '0')}/${y}`;
};

// Convert minutes to "h:mm"
const formatTime = (minutes: number): string => {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;

	return `${h}:${m.toString().padStart(2, '0')}`;
};

export default function Rotations({ trips }) {
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
				style={{ overflow: 'overlay' }}
				className="h-full w-max max-w-full border-2 border-black bg-black"
			>
				<table className="table border-2 border-black text-center">
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
							<TripRow key={index} trip={trip} index={index} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function TripRow({ trip, index }: { trip: Trip; index: number }) {
	return (
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

				<BlockRow block={trip.blocks[0]} />

				<td rowSpan={trip.blocks.length}>{formatTime(trip.creditValue)}</td>
				<td rowSpan={trip.blocks.length}>{formatTime(trip.timeAwayFromBase)}</td>
			</tr>

			{trip.blocks.slice(1).map((block: Block, i: number) => (
				<tr
					key={`${trip.tripNumber}-${i}`}
					className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-200'}
				>
					<BlockRow block={block} />
				</tr>
			))}
		</Fragment>
	);
}

function BlockRow({ block }: { block: Block }) {
	return (
		<>
			<td className="whitespace-nowrap">
				{block.date.length > 0 && formatDate(block.date)}
			</td>
			<td>{block.startAirport}</td>
			<td>{block.endAirport}</td>
			<td>{formatTime(block.duration)}</td>
			<td>{block.mileage}</td>
			<td>{block.layover && block.endAirport}</td>
			<td>{block.aircraft.make}</td>
			<td>{block.aircraft.model}</td>
			<td>{block.aircraft.body}</td>
			<td>{block.flightNumber}</td>
		</>
	);
}
