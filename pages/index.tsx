import { GetServerSideProps } from 'next';
import Head from 'next/head';
import AircraftsData from '../components/Home/AircraftsData';
import FlightsData from '../components/Home/FlightsData';
import MiscData from '../components/Home/MiscData';
import OverallData from '../components/Home/OverallData';
import TripsData from '../components/Home/TripsData';
import UsaMap from '../components/Home/UsaMap';
import { Trip, Block, getTrips } from '../lib/trips';

export const getServerSideProps: GetServerSideProps = async () => {
	const trips = await getTrips();

	const blocks: Block[] = [];
	trips.forEach((trip: Trip) => blocks.push(...trip.blocks));

	return { props: { trips, blocks } };
};

export default function Home({ trips, blocks }) {
	return (
		<div className="flex flex-col items-center gap-4 p-4">
			<Head>
				<title>Flight Log</title>
				<meta name="description" content="Next.js App" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<OverallData trips={trips} blocks={blocks} />
			<AircraftsData blocks={blocks} />
			<TripsData trips={trips} />
			<FlightsData blocks={blocks} />
			<MiscData blocks={blocks} />
			<UsaMap blocks={blocks} />
		</div>
	);
}
