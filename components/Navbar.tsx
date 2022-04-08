import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navigation = [
	{ name: 'Home', href: '/' },
	{ name: 'Rotations', href: '/rotations' },
	{ name: 'Add Rotation', href: '/add' },
];

/**
 * Tailwind UI navbar
 */
export default function Navbar() {
	const { pathname } = useRouter();

	return (
		<Disclosure as="nav" className="bg-gray-800 px-4 lg:px-8">
			{({ open }) => (
				<>
					<div className="relative flex h-14 items-center justify-between">
						<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
							{/* Mobile menu button*/}
							<Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
								<span className="sr-only">Open main menu</span>
								{open ? (
									<XIcon className="block h-6 w-6" aria-hidden="true" />
								) : (
									<MenuIcon className="block h-6 w-6" aria-hidden="true" />
								)}
							</Disclosure.Button>
						</div>
						<div className="flex w-full items-center justify-center sm:justify-between">
							<p className="h-max font-bold text-gray-300">Flight Log</p>
							<div className="hidden sm:ml-6 sm:block">
								<div className="flex space-x-4">
									{navigation.map(({ name, href }) => (
										<Link key={name} href={href}>
											<a
												className={classNames(
													href === pathname
														? 'bg-gray-900 text-white'
														: 'text-gray-300 hover:bg-gray-700 hover:text-white',
													'rounded-md px-3 py-2 text-sm font-medium'
												)}
												aria-current={href === pathname ? 'page' : undefined}
											>
												{name}
											</a>
										</Link>
									))}
								</div>
							</div>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						<div className="flex flex-col gap-1 px-2 pt-2 pb-3">
							{navigation.map(({ name, href }) => (
								<Disclosure.Button
									key={name}
									aria-current={href === pathname ? 'page' : undefined}
									className="block w-full"
								>
									<Link href={href}>
										<a
											className={classNames(
												href === pathname
													? 'bg-gray-900 text-white'
													: 'text-gray-300 hover:bg-gray-700 hover:text-white',
												'block rounded-md px-3 py-2 text-base font-medium'
											)}
										>
											{name}
										</a>
									</Link>
								</Disclosure.Button>
							))}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
