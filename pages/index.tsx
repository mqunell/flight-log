import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import UsaMap from '../components/UsaMap';
import { Trip, Block, getTrips } from '../lib/trips';

const cityStates = [
	{ airportCode: 'ATL', city: 'Atlanta', state: 'GA' },
	{ airportCode: 'AUS', city: 'Austin', state: 'TX' },
	{ airportCode: 'BIL', city: 'Billings', state: 'MT' },
	{ airportCode: 'BOS', city: 'Boston', state: 'MA' },
	{ airportCode: 'CLT', city: 'Charlotte', state: 'NC' },
	{ airportCode: 'DCA', city: 'Washington D.C.', state: 'DC' },
	{ airportCode: 'DEN', city: 'Denver', state: 'CO' },
	{ airportCode: 'DFW', city: 'Dallas-Fort Worth', state: 'TX' },
	{ airportCode: 'DTW', city: 'Detroit', state: 'MI' },
	{ airportCode: 'FLL', city: 'Fort Lauderdale', state: 'FL' },
	{ airportCode: 'FSD', city: 'Sioux Falls', state: 'SD' },
	{ airportCode: 'GRR', city: 'Grand Rapids', state: 'MI' },
	{ airportCode: 'GSO', city: 'Greensboro', state: 'NC' },
	{ airportCode: 'JAX', city: 'Jacksonville', state: 'FL' },
	{ airportCode: 'LAS', city: 'Las Vegas', state: 'NV' },
	{ airportCode: 'LGA', city: 'New York', state: 'NY' },
	{ airportCode: 'MCI', city: 'Kansas City', state: 'MO' },
	{ airportCode: 'MSP', city: 'Minneapolis', state: 'MN' },
	{ airportCode: 'MSY', city: 'New Orleans', state: 'LA' },
	{ airportCode: 'ORD', city: 'Chicago', state: 'IL' },
	{ airportCode: 'PHX', city: 'Phoenix', state: 'AZ' },
	{ airportCode: 'RDU', city: 'Raleigh-Durham', state: 'NC' },
	{ airportCode: 'RIC', city: 'Richmond', state: 'VA' },
	{ airportCode: 'RSW', city: 'Fort Myers', state: 'FL' },
	{ airportCode: 'SAT', city: 'San Antonio', state: 'TX' },
	{ airportCode: 'SEA', city: 'Seattle', state: 'WA' },
	{ airportCode: 'SRQ', city: 'Sarasota', state: 'FL' },
	{ airportCode: 'STL', city: 'St. Louis', state: 'MO' },
	{ airportCode: 'TPA', city: 'Tampa', state: 'FL' },
];

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
		creditValue: trips.reduce((acc, trip) => acc + trip.creditValue, 0),
		timeAwayFromBase: trips.reduce((acc, trip) => acc + trip.timeAwayFromBase, 0),
		aircraft: {
			airbus: allBlocks.filter((block) => block.aircraft.make === 'A').length,
			boeing: allBlocks.filter((block) => block.aircraft.make === 'B').length,
			other: allBlocks.filter((block) => block.aircraft.make === 'O').length,
			narrow: allBlocks.filter((block) => block.aircraft.body === 'N').length,
			wide: allBlocks.filter((block) => block.aircraft.body === 'W').length,
		},
		stateCounts: {},
	};

	allBlocks.forEach((block) => {
		const endState = cityStates.find((cs) => cs.airportCode === block.endAirport)?.state;
		if (!endState) return;

		totals.stateCounts[endState] = (totals.stateCounts[endState] || 0) + 1;
	});

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
				<TotalsRow label="Credit value" value={totals.creditValue} />
				<TotalsRow label="Time away" value={totals.timeAwayFromBase} />
				<TotalsRow label="Airbus" value={totals.aircraft.airbus} />
				<TotalsRow label="Boeing" value={totals.aircraft.boeing} />
				<TotalsRow label="Other" value={totals.aircraft.other} />
				<TotalsRow label="Narrowbody" value={totals.aircraft.narrow} />
				<TotalsRow label="Widebody" value={totals.aircraft.wide} />
			</div>

			<UsaMap stateCounts={totals.stateCounts} />
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
