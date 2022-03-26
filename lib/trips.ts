import dbConnect from './dbConnect';
import DbTrip from '../models/Trip';

export interface Trip {
	tripNumber: number;
	rotation: string;
	tripLength: number;
	blocks: Block[];
	creditValue: number; // minutes
	timeAwayFromBase: number; // minutes
}

export interface Block {
	date: string;
	startAirport: string;
	endAirport: string;
	duration: number; // minutes
	mileage: number;
	layover: boolean;
	aircraft: {
		make: 'A' | 'B' | 'O'; // Airbus, Boeing, other
		model: string;
		body: 'N' | 'W'; // narrow, wide
	};
	flightNumber: number;
}

export interface City {
	airportCode: string;
	city: string;
	state: string;
}

export async function saveTrip(trip: Trip) {
	await dbConnect();

	new DbTrip(trip)
		.save()
		.then((newTrip) => console.log(`${newTrip.tripNumber} saved`))
		.catch((error) => console.log(error));
}

export async function getTrips(): Promise<Trip[]> {
	await dbConnect();

	const docs = await DbTrip.find();

	// Remove _id ObjectId from each database object
	const trips = docs
		.map((doc) => {
			const trip = doc.toObject();
			delete trip._id;

			trip.blocks.forEach((block) => {
				delete block._id;
			});

			return trip;
		})
		.sort((a, b) => (a.tripNumber < b.tripNumber ? -1 : 1));

	return trips;
}
