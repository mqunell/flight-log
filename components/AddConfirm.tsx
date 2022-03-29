import { Fragment, useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

export default function AddConfirm({ isOpen, close, resetForm, pendingTrip }) {
	const [tripNumber, setTripNumber] = useState();

	useEffect(() => {
		axios.get('/api/tripNumber').then((res) => setTripNumber(res.data.tripNumber));
	}, []);

	const getTripLength = () => {
		const { blocks } = pendingTrip;

		let tripLength = 1;
		for (let i = 1; i < blocks.length; i++) {
			if (blocks[i].date !== blocks[i - 1].date) tripLength++;
		}

		return tripLength;
	};

	const convertToMinutes = (value: string) => {
		const [h, m] = value.split(':');
		return parseInt(h) * 60 + parseInt(m);
	};

	const onConfirm = () => {
		const newTrip = {
			tripNumber,
			rotation: pendingTrip.rotation,
			tripLength: getTripLength(),
			blocks: pendingTrip.blocks.map((pendingBlock) => ({
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
				>
					<div className="fixed inset-0 flex items-center justify-center p-4">
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

							<ConfirmationData
								pendingTrip={pendingTrip}
								tripNumber={tripNumber}
								tripLength={getTripLength()}
							/>

							<input
								type="button"
								className="form-input mt-2 bg-slate-300"
								onClick={onConfirm}
								value="Confirm"
							/>
						</motion.div>
					</div>
				</Dialog>
			)}
		</AnimatePresence>
	);
}

function ConfirmationData({ pendingTrip, tripNumber, tripLength }) {
	// Convert "yyyy-mm-dd" to "ddMMM yyyy" for displaying
	const formatDate = (dateString: string): string => {
		const [y, m, d] = dateString.split('-');

		const monthText = new Date(dateString).toLocaleString('en-US', { month: 'short' });

		return `${d}${monthText} ${y}`;
	};

	return (
		<Dialog.Description>
			{/* Rotation */}
			<p>
				Rotation: <span className="font-medium">{pendingTrip.rotation}</span>
			</p>

			<div className="grid grid-cols-2">
				<p>
					Trip number: <span className="font-medium">{tripNumber}</span>
				</p>
				<p className="text-right">
					Credit value: <span className="font-medium">{pendingTrip.creditValue}</span>
				</p>
				<p>
					Trip length: <span className="font-medium">{tripLength}</span>
				</p>
				<p className="text-right">
					Time away: <span className="font-medium">{pendingTrip.timeAwayFromBase}</span>
				</p>
			</div>

			{/* Blocks */}
			{pendingTrip.blocks.map((pendingBlock, index: number) => (
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
