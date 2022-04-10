import { Switch } from '@headlessui/react';

interface ToggleProps {
	text: string;
	checked: boolean;
	onClick: Function;
}

/**
 * Styled implementation of Headless UI's Switch
 */
export default function Toggle({ text, checked, onClick }: ToggleProps) {
	return (
		<Switch.Group key={`toggle-${text}`}>
			<div className="flex w-auto items-center gap-2">
				<Switch
					checked={checked}
					onChange={() => onClick()}
					className={`${
						checked ? 'bg-theme-blue-dark' : 'bg-gray-500'
					} relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-300`}
				>
					<span className="sr-only">{text}</span>
					<span
						className={`${
							checked ? 'translate-x-5' : 'translate-x-1'
						} inline-block h-4 w-4 transform rounded-full bg-white transition duration-300`}
					/>
				</Switch>
				<Switch.Label>{text}</Switch.Label>
			</div>
		</Switch.Group>
	);
}
