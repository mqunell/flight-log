import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'csv-parse/sync';
import { Trip, Block, saveTrip } from '../../lib/trips';

/**
 * This API route parses a CSV export of the log spreadsheet from Google Drive, formats the data as
 * JSON, and adds the full trip to the database. Once this project gets to a point where the log
 * spreadsheet is no longer being used, this route will become unnecessary.
 */

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
	AIRCRAFT_MAKE,
	AIRCRAFT_MODEL,
	AIRCRAFT_BODY,
	FLIGHT_NUMBER,

	CREDIT_VALUE,
	TIME_AWAY_FROM_BASE,
] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

// Parse raw CSV text and add objects to database
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const rawText = req.body;

	const records = parseCsv(rawText);
	const json = formatJson(records);

	// json.forEach((trip: Trip) => saveTrip(trip));

	res.status(200).json(json);
}

// Convert "hh:mm" to minutes
function convertToMinutes(input: string): number {
	const hoursMinutes = input.split(':');

	const hours = parseInt(hoursMinutes[0]);
	const minutes = parseInt(hoursMinutes[1]);

	return hours * 60 + minutes;
}

// Convert "mm/dd/yyyy" to "yyyy-mm-dd"
function formatDate(input: string): string {
	const [m, d, y] = input.split('/');
	return `${y}-${m}-${d}`;
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
			date: formatDate(prevDate),
			startAirport: row[DEPARTURE_AIRPORT],
			endAirport: row[ARRIVAL_AIRPORT],
			duration: convertToMinutes(row[BLOCK_TIME]),
			mileage: parseInt(row[MILEAGE]),
			layover: row[LAYOVER].length > 0,
			aircraft: {
				make: row[AIRCRAFT_MAKE] as 'A' | 'B' | 'O',
				model: row[AIRCRAFT_MODEL],
				body: row[AIRCRAFT_BODY] as 'N' | 'W',
			},
			flightNumber: parseInt(row[FLIGHT_NUMBER]),
		};

		if (currentTrip) currentTrip.blocks.push(rowBlock);
	});

	if (currentTrip) allTrips.push(currentTrip);

	return allTrips;
}
