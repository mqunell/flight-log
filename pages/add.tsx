import { Fragment, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import AddConfirm from '../components/AddConfirm';

// Aircrafts with wide bodies
const wideAircrafts = [
	{ make: 'A', model: '330' },
	{ make: 'A', model: '350' },
	{ make: 'B', model: '767' },
];

/**
 * Add form needs to get:
 *   trip: rotation #, credit value, time away - everything else calculated by blocks
 *   blocks: everything
 */
export default function Add() {
	const {
		control,
		register,
		getValues,
		setValue,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm();

	const { fields, append, remove } = useFieldArray({ control, name: 'blocks' });

	const [showModal, setShowModal] = useState(false);

	// Change handler for blocks' make and model fields to set body to 'W' if applicable
	const watchMakeModel = ({ target }) => {
		const { name } = target; // ex: 'blocks.0.aircraft.make'

		const index = parseInt(name.split('.')[1]);
		const inputAircraft = watch('blocks')[index].aircraft;

		wideAircrafts.forEach(({ make, model }) => {
			if (inputAircraft.make === make && inputAircraft.model === model) {
				setValue(`blocks.${index}.aircraft.body`, 'W');
			}
		});
	};

	// Capitalize a field as it is typed in
	const capitalizeField = ({ target }) => {
		setValue(target.name, target.value.toUpperCase());
	};

	// Validate data before showing AddConfirm modal
	const onSubmit = (data: any) => setShowModal(true);

	return (
		<>
			<form
				className="my-4 mx-auto flex w-80 flex-col gap-3 text-white"
				onSubmit={handleSubmit(onSubmit)}
			>
				<h1 className="text-center text-xl underline underline-offset-2">
					Add a Rotation
				</h1>

				<label>
					Rotation #
					<input
						type="text"
						className="focus:ring-offset-slate-500"
						placeholder="1234"
						{...register('rotation', { required: true })}
						onChange={capitalizeField}
					/>
				</label>

				<label>
					Credit value
					<input
						type="text"
						className="focus:ring-offset-slate-500"
						placeholder="1:23"
						{...register('creditValue', {
							pattern: /\d{1,3}:\d{2}/g,
							required: true,
						})}
					/>
				</label>

				<label>
					Time away
					<input
						type="text"
						className="focus:ring-offset-slate-500"
						placeholder="34:56"
						{...register('timeAwayFromBase', {
							pattern: /\d{1,3}:\d{2}/g,
							required: true,
						})}
					/>
				</label>

				<hr className="my-3" />

				{fields.map((field, index) => (
					<Fragment key={field.id}>
						<h2 className="text-center text-xl underline underline-offset-2">
							Block #{index + 1}
						</h2>

						<label>
							Date
							<input
								type="date"
								className="focus:ring-offset-slate-500"
								defaultValue={
									index === 0
										? new Date().toISOString().slice(0, 10)
										: getValues().blocks[index - 1].date
								}
								{...register(`blocks.${index}.date`, {
									required: true,
								})}
							/>
						</label>

						<label>
							Departure
							<input
								type="text"
								className="focus:ring-offset-slate-500"
								placeholder="MSP"
								defaultValue={
									index === 0 ? 'MSP' : getValues().blocks[index - 1].endAirport
								}
								{...register(`blocks.${index}.startAirport` as const, {
									minLength: 3,
									maxLength: 3,
									pattern: /[a-zA-Z]{3}/,
									required: true,
								})}
								onChange={capitalizeField}
							/>
						</label>

						<label>
							Arrival
							<input
								type="text"
								className="focus:ring-offset-slate-500"
								placeholder="SEA"
								{...register(`blocks.${index}.endAirport` as const, {
									minLength: 3,
									maxLength: 3,
									pattern: /[a-zA-Z]{3}/,
									required: true,
								})}
								onChange={capitalizeField}
							/>
						</label>

						<label>
							Block time
							<input
								type="text"
								className="focus:ring-offset-slate-500"
								placeholder="1:23"
								{...register(`blocks.${index}.duration`, {
									pattern: /\d{1,3}:\d{2}/g,
									required: true,
								})}
							/>
						</label>

						<label>
							Mileage
							<input
								type="number"
								className="focus:ring-offset-slate-500"
								placeholder="800"
								{...register(`blocks.${index}.mileage`, {
									required: true,
								})}
							/>
						</label>

						<label>
							Layover
							<div className="flex items-center gap-1">
								<input
									type="checkbox"
									className="focus:ring-offset-slate-500"
									{...register(`blocks.${index}.layover`)}
								/>
								Yes
							</div>
						</label>

						<label>
							Aircraft Make
							<input
								type="text"
								className="focus:ring-offset-slate-500"
								placeholder="(A)irbus, (B)oeing, (O)ther"
								{...register(`blocks.${index}.aircraft.make`, {
									pattern: /[A-Z]{1}/,
									required: true,
								})}
								onChange={(e) => {
									capitalizeField(e);
									watchMakeModel(e);
								}}
							/>
						</label>

						<label>
							Aircraft Model
							<input
								type="text"
								className="focus:ring-offset-slate-500"
								placeholder="737"
								{...register(`blocks.${index}.aircraft.model`, {
									required: true,
								})}
								onChange={(e) => {
									capitalizeField(e);
									watchMakeModel(e);
								}}
							/>
						</label>

						<label>
							Aircraft Body
							<input
								type="text"
								className="focus:ring-offset-slate-500"
								placeholder="(N)arrow, (W)ide"
								{...register(`blocks.${index}.aircraft.body`, {
									pattern: /[A-Z]{1}/,
									required: true,
								})}
								onChange={capitalizeField}
							/>
						</label>

						<label>
							Flight #
							<input
								type="number"
								className="focus:ring-offset-slate-500"
								placeholder="7890"
								{...register(`blocks.${index}.flightNumber`, {
									required: true,
								})}
							/>
						</label>
					</Fragment>
				))}

				{fields.length > 0 && <hr className="my-3" />}

				<input
					type="button"
					className="form-input focus:ring-offset-slate-500"
					onClick={() => append({})}
					value="Add Block"
				/>

				{fields.length > 0 && (
					<>
						<input
							type="button"
							className="form-input focus:ring-offset-slate-500"
							onClick={() => remove(fields.length - 1)}
							value="Remove Block"
						/>
						<input
							type="submit"
							className="form-input focus:ring-offset-slate-500"
							value="Submit"
						/>
					</>
				)}
			</form>

			<AddConfirm
				isOpen={showModal}
				close={() => setShowModal(false)}
				resetForm={reset}
				pendingTrip={getValues()}
			/>
		</>
	);
}
