import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
	tripNumber: {
		type: Number,
		unique: true,
	},
	rotation: String,
	tripLength: Number,
	blocks: [
		{
			date: String,
			startAirport: String,
			endAirport: String,
			duration: Number, // minutes
			mileage: Number,
			layover: Boolean,
			aircraftLetter: {
				type: String,
				enum: ['A', 'B', 'O'],
			},
			aircraftNumber: String,
			aircraftBody: {
				type: String,
				enum: ['N', 'W'],
			},
			flightNumber: Number,
		},
	],
	creditValue: Number, // minutes
	timeAwayFromBase: Number, // minutes
});

export default mongoose.models.Trip || mongoose.model('Trip', tripSchema);
