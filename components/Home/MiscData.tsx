import { Block } from '../../lib/trips';

interface Props {
	blocks: Block[];
}

const GLOBE_MILES = 24880;
const MOON_MILES = 237674;

export default function MiscData({ blocks }: Props) {
	// Sum the total mileage traveled
	const totalMiles = blocks.reduce((acc: number, block: Block) => acc + block.mileage, 0);

	// Round a number to 2 decimal places without trailing 0s
	const roundNumber = (num: number): string => {
		let rounded = num.toFixed(2).toString();

		while (rounded.endsWith('0')) rounded = rounded.slice(0, rounded.length - 1);
		if (rounded.endsWith('.')) rounded = rounded.slice(0, rounded.length - 1);

		return rounded;
	};

	// Calculate times around the globe and distance to the moon
	const globe = roundNumber(totalMiles / GLOBE_MILES);
	const moon = roundNumber((totalMiles / MOON_MILES) * 100);

	return (
		<div className="flex flex-col text-white">
			<p>I have flown enough miles to travel around the globe {globe} times!</p>
			<p>I have flown {moon}% the way to the moon!</p>
		</div>
	);
}
