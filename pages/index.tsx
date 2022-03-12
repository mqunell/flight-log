import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
	return (
		<div className="flex flex-col items-center gap-2 p-4">
			<Head>
				<title>Flight Log</title>
				<meta name="description" content="Next.js App" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className="text-white">Home</h1>
			<Link href="/rotations">
				<a className="text-blue-300 hover:underline">Rotations</a>
			</Link>
		</div>
	);
}
