module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			backgroundColor: {
				'theme-blue-dark': 'rgb(0, 80, 255)',
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
