import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import UsaMap from '../components/Home/UsaMap';
import { Trip, Block, getTrips } from '../lib/trips';

export const getServerSideProps: GetServerSideProps = async () => {
	const trips = await getTrips();

	const blocks: Block[] = [];
	trips.forEach((trip: Trip) => blocks.push(...trip.blocks));

	// Calculate total values across all trips/blocks
	/* const totals = {
		trips: trips.length,
		blocks: allBlocks.length,
		daysFlown: new Set(allBlocks.map((block) => block.date)).size,
		mileage: allBlocks.reduce((acc, block) => acc + block.mileage, 0),
		timeInAir: allBlocks.reduce((acc, block) => acc + block.duration, 0),
		creditValue: trips.reduce((acc, trip) => acc + trip.creditValue, 0),
		timeAwayFromBase: trips.reduce((acc, trip) => acc + trip.timeAwayFromBase, 0),
		aircraft: {
			airbus: allBlocks.filter((block) => block.aircraft.make === 'A').length,
			boeing: allBlocks.filter((block) => block.aircraft.make === 'B').length,
			other: allBlocks.filter((block) => block.aircraft.make === 'O').length,
			narrow: allBlocks.filter((block) => block.aircraft.body === 'N').length,
			wide: allBlocks.filter((block) => block.aircraft.body === 'W').length,
		},
	}; */

	return { props: { trips, blocks } };
};

export default function Home({ trips, blocks }) {
	return (
		<div className="flex flex-col items-center gap-2 p-4">
			<Head>
				<title>Flight Log</title>
				<meta name="description" content="Next.js App" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Link href="/rotations">
				<a className="text-blue-300 hover:underline">Rotations</a>
			</Link>
			<Link href="/add">
				<a className="text-blue-300 hover:underline">Add</a>
			</Link>

			{/* <div className="grid grid-cols-2 gap-x-4 gap-y-1 border-t border-white px-4 py-2 text-white">
				<TotalsRow label="Trips" value={totals.trips} />
				<TotalsRow label="Blocks" value={totals.blocks} />
				<TotalsRow label="Days flown" value={totals.daysFlown} />
				<TotalsRow label="Miles" value={totals.mileage} />
				<TotalsRow label="Block time" value={totals.timeInAir} />
				<TotalsRow label="Credit value" value={totals.creditValue} />
				<TotalsRow label="Time away" value={totals.timeAwayFromBase} />
				<TotalsRow label="Airbus" value={totals.aircraft.airbus} />
				<TotalsRow label="Boeing" value={totals.aircraft.boeing} />
				<TotalsRow label="Other" value={totals.aircraft.other} />
				<TotalsRow label="Narrowbody" value={totals.aircraft.narrow} />
				<TotalsRow label="Widebody" value={totals.aircraft.wide} />
			</div> */}

			<UsaMap blocks={blocks} />
		</div>
	);
}

/* function TotalsRow({ label, value }) {
	return (
		<>
			<p className="text-right">{label}</p>
			<p className="font-bold">{value}</p>
		</>
	);
} */
