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
	date: string;
	startAirport: string;
	endAirport: string;
	duration: number; // minutes
	mileage: number;
	layover: boolean;
	aircraftLetter: 'A' | 'B' | 'O';
	aircraftNumber: number;
	aircraftBody: 'N' | 'W';
	flightNumber: number;
}

export interface City {
	airportCode: string;
	city: string;
	state: string;
}

export async function getTrips(): Promise<Trip[]> {
	const trips: Trip[] = JSON.parse(fs.readFileSync('./log.json').toString());
	return trips;
}
