import { NextApiRequest, NextApiResponse } from 'next';
import { getTrips } from '../../lib/trips';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const allTrips = await getTrips();
	res.status(200).json({ tripNumber: allTrips.length + 1 });
}
