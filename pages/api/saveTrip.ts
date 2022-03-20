import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import DbTrip from '../../models/Trip';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { newTrip } = req.body;

	await dbConnect();
	new DbTrip(newTrip)
		.save()
		.then(() => res.status(200).send(''))
		.catch((error) => res.status(400).send(error));
}
