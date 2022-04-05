import { Fragment, useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
	isOpen: boolean;
	close: () => void;
	resetForm: () => void;
	pendingTrip: PendingTrip | any;
}

// Almost all PendingTrip/PendingBlock fields are strings because they come from form inputs
interface PendingTrip {
	rotation: string;
	blocks: PendingBlock[];
	creditValue: string;
	timeAwayFromBase: string;
}

interface PendingBlock {
	date: string;
	startAirport: string;
	endAirport: string;
	duration: string;
	mileage: string;
	layover: boolean;
	aircraft: {
		make: 'A' | 'B' | 'O';
		model: string;
		body: 'N' | 'W';
	};
	flightNumber: string;
}

export default function AddConfirm({ isOpen, close, resetForm, pendingTrip }: Props) {
	// Trip values that are determined by other values/data
	const [tripNumber, setTripNumber] = useState<number>();
	const [tripLength, setTripLength] = useState<number>();

	useEffect(() => {
		// Get next trip number
		axios.get('/api/tripNumber').then((res) => setTripNumber(res.data.tripNumber));

		// Calculate trip length
		const { blocks } = pendingTrip;

		let count = 1;
		for (let i = 1; i < blocks.length; i++) {
			if (blocks[i].date !== blocks[i - 1].date) count++;
		}

		setTripLength(count);
	}, [pendingTrip]);

	// Convert "1:23" to 83
	const convertToMinutes = (value: string): number => {
		const [h, m] = value.split(':');
		return parseInt(h) * 60 + parseInt(m);
	};

	// Convert the PendingTrip to a Trip, add it to the database, then close the modal and reset the form
	const onConfirm = () => {
		const newTrip = {
			tripNumber,
			rotation: pendingTrip.rotation,
			tripLength,
			blocks: pendingTrip.blocks.map((pendingBlock: PendingBlock) => ({
				date: pendingBlock.date,
				startAirport: pendingBlock.startAirport,
				endAirport: pendingBlock.endAirport,
				duration: convertToMinutes(pendingBlock.duration),
				mileage: parseInt(pendingBlock.mileage),
				layover: pendingBlock.layover,
				aircraft: {
					make: pendingBlock.aircraft.make,
					model: pendingBlock.aircraft.model,
					body: pendingBlock.aircraft.body,
				},
				flightNumber: parseInt(pendingBlock.flightNumber),
			})),
			creditValue: convertToMinutes(pendingTrip.creditValue),
			timeAwayFromBase: convertToMinutes(pendingTrip.timeAwayFromBase),
		};

		axios
			.post('/api/saveTrip', { newTrip })
			.then(() => {
				// The modal must be closed/unrendered before resetting the form
				close();
				resetForm();
				setTimeout(() => alert('Success'), 350);
			})
			.catch((error) => alert(error));
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<Dialog
					key="modal"
					static
					as={motion.div}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					open={isOpen}
					onClose={close}
					className="fixed inset-0 flex items-center justify-center p-4"
				>
					<Dialog.Overlay className="absolute h-full w-full bg-black opacity-70" />

					<motion.div
						key="modal-content"
						initial={{ y: 80 }}
						animate={{ scale: 1, y: 0 }}
						exit={{ scale: 0 }}
						className="relative flex w-[22rem] max-w-full flex-col gap-2 rounded bg-white p-6 shadow-xl"
					>
						<Dialog.Title as="h1" className="text-lg font-medium">
							Confirm Data
						</Dialog.Title>

						<DisplayData
							pendingTrip={pendingTrip}
							tripNumber={tripNumber}
							tripLength={tripLength}
						/>

						<input
							type="button"
							className="form-input mt-2 bg-slate-300"
							onClick={onConfirm}
							value="Confirm"
						/>
					</motion.div>
				</Dialog>
			)}
		</AnimatePresence>
	);
}

/**
 * Helper component purely for displaying the PendingTrip and PendingBlocks
 */
function DisplayData({ pendingTrip, tripNumber, tripLength }) {
	// Convert "yyyy-mm-dd" to "ddMMM yyyy" for displaying
	const formatDate = (dateString: string): string => {
		const [y, m, d] = dateString.split('-');

		const monthText = new Date(dateString).toLocaleString('en-US', { month: 'short' });

		return `${d}${monthText} ${y}`;
	};

	// Wrap a value in a 'font-medium' span
	const semiBold = (data: string) => <span className="font-medium">{data}</span>;

	return (
		<Dialog.Description>
			{/* Rotation */}
			<p>Rotation: {semiBold(pendingTrip.rotation)}</p>

			<div className="grid grid-cols-2">
				<p className="text-left">Trip number: {semiBold(tripNumber)}</p>
				<p className="text-right">Credit value: {semiBold(pendingTrip.creditValue)}</p>
				<p className="text-left">Trip length: {semiBold(tripLength)}</p>
				<p className="text-right">Time away: {semiBold(pendingTrip.timeAwayFromBase)}</p>
			</div>

			{/* Blocks */}
			{pendingTrip.blocks.map((pendingBlock: PendingBlock, index: number) => (
				<Fragment key={`${pendingTrip.rotation}-${index}`}>
					<hr className="my-2" />

					{(index === 0 || pendingBlock.date !== pendingTrip.blocks[index - 1].date) && (
						<p className="font-medium">{formatDate(pendingBlock.date)}</p>
					)}
					<div className="grid grid-cols-2">
						<p>
							{pendingBlock.startAirport.toUpperCase()} &gt;{' '}
							{pendingBlock.endAirport.toUpperCase()}
							{pendingBlock.layover && ' ⏸'}
						</p>
						<p className="text-right">
							{pendingBlock.aircraft.make} {pendingBlock.aircraft.model} -{' '}
							{pendingBlock.aircraft.body}
						</p>
						<p>
							{pendingBlock.duration}, {pendingBlock.mileage} miles
						</p>
						<p className="text-right">Flight #{pendingBlock.flightNumber}</p>
					</div>
				</Fragment>
			))}
		</Dialog.Description>
	);
}
