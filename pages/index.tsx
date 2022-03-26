import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Trip, Block, getTrips } from '../lib/trips';

export const getServerSideProps: GetServerSideProps = async () => {
	const trips = await getTrips();

	const allBlocks: Block[] = [];
	trips.forEach((trip: Trip) => allBlocks.push(...trip.blocks));

	const totals = {
		trips: trips.length,
		blocks: allBlocks.length,
		daysFlown: new Set(allBlocks.map((block) => block.date)).size,
		mileage: allBlocks.reduce((acc, block) => acc + block.mileage, 0),
		timeInAir: allBlocks.reduce((acc, block) => acc + block.duration, 0),
		credits: trips.reduce((acc, trip) => acc + trip.creditValue, 0),
		timeAway: trips.reduce((acc, trip) => acc + trip.timeAwayFromBase, 0),
		airbus: allBlocks.filter((block) => block.aircraft.make === 'A').length,
		boeing: allBlocks.filter((block) => block.aircraft.make === 'B').length,
		other: allBlocks.filter((block) => block.aircraft.make === 'O').length,
		narrow: allBlocks.filter((block) => block.aircraft.body === 'N').length,
		wide: allBlocks.filter((block) => block.aircraft.body === 'W').length,
	};

	return { props: { totals } };
};

export default function Home({ totals }) {
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

			<div className="grid grid-cols-2 gap-x-4 gap-y-1 border-t border-white px-4 py-2 text-white">
				<TotalsRow label="Trips" value={totals.trips} />
				<TotalsRow label="Blocks" value={totals.blocks} />
				<TotalsRow label="Days flown" value={totals.daysFlown} />
				<TotalsRow label="Miles" value={totals.mileage} />
				<TotalsRow label="Block time" value={totals.timeInAir} />
				<TotalsRow label="Credit value" value={totals.credits} />
				<TotalsRow label="Time away" value={totals.timeAway} />
				<TotalsRow label="Airbus" value={totals.airbus} />
				<TotalsRow label="Boeing" value={totals.boeing} />
				<TotalsRow label="Other" value={totals.other} />
				<TotalsRow label="Narrowbody" value={totals.narrow} />
				<TotalsRow label="Widebody" value={totals.wide} />
			</div>
		</div>
	);
}

function TotalsRow({ label, value }) {
	return (
		<>
			<p className="text-right">{label}</p>
			<p className="font-bold">{value}</p>
		</>
	);
}
