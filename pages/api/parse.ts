import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { Trip, Block } from '../../lib/trips';

// CSV indexes
const [
	TRIP_NUMBER,
	ROTATION,
	TRIP_LENGTH,

	DATE,
	DEPARTURE_AIRPORT,
	ARRIVAL_AIRPORT,
	BLOCK_TIME,
	MILEAGE,
	LAYOVER,
	AIRCRAFT_LETTER,
	AIRCRAFT_NUMBER,
	BODY_TYPE,
	FLIGHT_NUMBER,

	CREDIT_VALUE,
	TIME_AWAY_FROM_BASE,
] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

/**
 * Parse raw CSV text and export as a JSON file
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const rawText = req.body;

	const records = parseCsv(rawText);
	const json = formatJson(records);

	res.status(200).json(json);
	fs.writeFileSync('log.json', JSON.stringify(json));
}

// Convert "hh:mm" to minutes
function convertToMinutes(input: String): number {
	const hoursMinutes = input.split(':');

	const hours = parseInt(hoursMinutes[0]);
	const minutes = parseInt(hoursMinutes[1]);

	return hours * 60 + minutes;
}

// Read and parse the CSV file, skipping the first two lines - becomes a [[string]]
function parseCsv(rawText: string): string[][] {
	const csv = rawText.split('\n').slice(2).join('\n');
	const records = parse(csv);

	return records;
}

// Format the CSV records as JSON
function formatJson(records: string[][]): Trip[] {
	// Declare/initialize CSV variables
	const allTrips: Trip[] = [];
	let currentTrip: Trip | null = null; // Initial assignment required for accessing the variable outside the loop
	let prevDate: string;

	// Loop through the lines of the CSV file
	records.forEach((row: string[]) => {
		// If there is a new trip number...
		if (row[TRIP_NUMBER] !== '') {
			// Add currentTrip to allTrips (when not on row 1)
			if (currentTrip) allTrips.push(currentTrip);

			// Initialize currentTrip
			currentTrip = {
				tripNumber: parseInt(row[TRIP_NUMBER]),
				rotation: row[ROTATION],
				tripLength: parseInt(row[TRIP_LENGTH]),
				blocks: [],
				creditValue: convertToMinutes(row[CREDIT_VALUE]),
				timeAwayFromBase: convertToMinutes(row[TIME_AWAY_FROM_BASE]),
			};

			// Initialize block data
			prevDate = row[DATE];
		}

		if (row[DATE].length) prevDate = row[DATE];

		// Parse the Block and add it to currentTrip.blocks
		const rowBlock: Block = {
			date: prevDate,
			startAirport: row[DEPARTURE_AIRPORT],
			endAirport: row[ARRIVAL_AIRPORT],
			duration: convertToMinutes(row[BLOCK_TIME]),
			mileage: parseInt(row[MILEAGE]),
			layover: row[LAYOVER].length > 0,
			aircraftLetter: row[AIRCRAFT_LETTER] as 'A' | 'B' | 'O',
			aircraftNumber: parseInt(row[AIRCRAFT_NUMBER]),
			aircraftBody: row[BODY_TYPE] as 'N' | 'W',
			flightNumber: parseInt(row[FLIGHT_NUMBER]),
		};

		if (currentTrip) currentTrip.blocks.push(rowBlock);
	});

	if (currentTrip) allTrips.push(currentTrip);

	return allTrips;
}
