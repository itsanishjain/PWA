module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	// darkMode: 'class',
	darkMode: false,

	plugins: [require('tailwindcss-safe-area')],
}
