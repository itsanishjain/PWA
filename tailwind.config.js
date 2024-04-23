module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	// darkMode: 'class',

	// This config was causing warnings:
	// warn - The `darkMode` option in your Tailwind CSS configuration is set to `false`, which now behaves the same as `media`.
	// warn - Change `darkMode` to `media` or remove it entirely.
	// warn - https://tailwindcss.com/docs/upgrade-guide#remove-dark-mode-configuration

	// darkMode: false,

	plugins: [require('tailwindcss-safe-area')],
}
