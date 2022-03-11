import fs from 'fs';

export interface Trip {
	tripNumber: number;
	rotation: string;
	tripLength: number;
	blocks: Block[];
	creditValue: number; // minutes
	timeAwayFromBase: number; // minutes
}

export interface Block {
	date: Date;
	startAirport: string;
	endAirport: string;
	duration: number; // minutes
	mileage: number;
	layover: boolean;
	aircraftLetter: 'A' | 'B';
	aircraftNumber: number;
	aircraftBody: 'N' | 'W';
	flightNumber: number;
}

export interface City {
	airportCode: string;
	city: string;
	state: string;
}

// Read the Trips from JSON
const trips: Trip[] = JSON.parse(fs.readFileSync('./log.json').toString());

export async function getTrips(): Promise<Trip[]> {
	return trips;
}
