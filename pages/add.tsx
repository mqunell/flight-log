import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

/**
 * Add form needs to get:
 *   trip: rotation #, credit value, time away - everything else calculated by blocks
 *   blocks: everything
 */
export default function Add() {
	const [tripNumber, setTripNumber] = useState();

	useEffect(() => {
		axios.get('/api/tripNumber').then((res) => setTripNumber(res.data.tripNumber));
	}, []);

	const {
		control,
		register,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const { fields, append, remove } = useFieldArray({ control, name: 'blocks' });

	const onSubmit = (data: any) => {
		console.log(data);
		console.log(JSON.stringify(data.blocks));
	};

	return (
		<form
			className="my-4 mx-auto flex w-80 flex-col gap-3 text-white"
			onSubmit={handleSubmit(onSubmit)}
		>
			<h1 className="bold text-center text-2xl">Add a Rotation</h1>
			<h2 className="text-xl underline underline-offset-2">Rotation Info</h2>
			<p className="flex justify-between">
				<span>Trip number: {tripNumber}</span>
				<span>Trip length: {getValues().blocks?.length}</span>
			</p>

			<label>
				Rotation #
				<input
					type="text"
					placeholder="1234"
					{...register('rotation', { required: true })}
				/>
			</label>

			<label>
				Credit value
				<input
					type="text"
					placeholder="01:23"
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
					placeholder="34:56"
					{...register('timeAwayFromBase', {
						pattern: /\d{1,3}:\d{2}/g,
						required: true,
					})}
				/>
			</label>

			<hr className="my-3" />

			{fields.map((item, index) => (
				<Fragment key={`block-${index}`}>
					<h2 className="text-xl underline underline-offset-2">Block #{index + 1}</h2>

					<label>
						Date
						<input
							type="date"
							defaultValue={index !== 0 ? getValues().blocks[index - 1].date : ''}
							{...register(`blocks.${index}.date`, {
								required: true,
							})}
						/>
					</label>

					<label>
						Departure
						<input
							type="text"
							defaultValue={index !== 0 ? getValues().blocks[index - 1].endAirport : ''}
							{...register(`blocks.${index}.startAirport` as const, {
								minLength: 3,
								maxLength: 3,
								pattern: /[a-zA-Z]{3}/,
								required: true,
							})}
						/>
					</label>

					<label>
						Arrival
						<input
							type="text"
							{...register(`blocks.${index}.endAirport` as const, {
								minLength: 3,
								maxLength: 3,
								pattern: /[a-zA-Z]{3}/,
								required: true,
							})}
						/>
					</label>

					<label>
						Block time
						<input
							type="text"
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
							{...register(`blocks.${index}.mileage`, {
								required: true,
							})}
						/>
					</label>

					<label>
						Layover
						<div className="flex items-center gap-1">
							<input type="checkbox" {...register(`blocks.${index}.layover`)} />
							Yes
						</div>
					</label>

					<label>
						Aircraft Letter
						<div className="flex items-center gap-1">
							<input
								type="text"
								{...register(`blocks.${index}.aircraftLetter`, {
									pattern: /[A-Z]{1}/,
									required: true,
								})}
							/>
						</div>
					</label>

					<label>
						Aircraft Number
						<div className="flex items-center gap-1">
							<input
								type="number"
								{...register(`blocks.${index}.aircraftNumber`, {
									required: true,
								})}
							/>
						</div>
					</label>

					<label>
						Aircraft Body
						<div className="flex items-center gap-1">
							<input
								type="text"
								{...register(`blocks.${index}.aircraftBody`, {
									pattern: /[A-Z]{1}/,
									required: true,
								})}
							/>
						</div>
					</label>

					<label>
						Flight Number
						<div className="flex items-center gap-1">
							<input
								type="number"
								{...register(`blocks.${index}.flightNumber`, {
									required: true,
								})}
							/>
						</div>
					</label>
				</Fragment>
			))}

			{fields.length > 0 && <hr className="my-3" />}

			<input
				type="button"
				className="form-input"
				onClick={() => append({})}
				value="Add Block"
			/>

			{fields.length > 0 && <input type="submit" className="form-input" value="Submit" />}
		</form>
	);
}
