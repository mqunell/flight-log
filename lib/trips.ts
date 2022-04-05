import mongoose from 'mongoose';
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

interface MongoTrip extends Trip {
	_id: mongoose.Types.ObjectId;
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

interface MongoBlock extends Block {
	_id: mongoose.Types.ObjectId;
}

export async function saveTrip(trip: Trip) {
	await dbConnect();

	new DbTrip(trip)
		.save()
		.then((newTrip: MongoTrip) => console.log(`${newTrip.tripNumber} saved`))
		.catch((error: Error) => console.log(error));
}

export async function getTrips(): Promise<Trip[]> {
	await dbConnect();

	const docs = await DbTrip.find();

	// Remove _id ObjectId from each database object
	const trips = docs
		.map((doc) => {
			const trip = doc.toObject();
			delete trip._id;

			trip.blocks.forEach((block: MongoBlock) => {
				delete block._id;
			});

			return trip;
		})
		.sort((a, b) => (a.tripNumber < b.tripNumber ? -1 : 1));

	return trips;
}
