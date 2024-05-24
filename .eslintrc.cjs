// @ts-check

const project = './tsconfig.eslint.json'

/** @type {import('eslint').Linter.Config} */
module.exports = {
	$schema: 'https://json.schemastore.org/eslintrc',
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project,
	},
	extends: [
		'next/core-web-vitals',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:@tanstack/eslint-plugin-query/recommended',
		'plugin:tailwindcss/recommended',
		'prettier',
	],
	plugins: ['@typescript-eslint'],
	rules: {
		'react/self-closing-comp': 1,
		'@typescript-eslint/no-unused-vars': [
			1,
			{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
		],

		// temporary disable
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/no-floating-promises': 0,
		'@typescript-eslint/no-misused-promises': 0,
		'@typescript-eslint/no-unsafe-argument': 0,
		'@typescript-eslint/no-unsafe-assignment': 0,
		'@typescript-eslint/no-unsafe-call': 0,
		'@typescript-eslint/no-unsafe-member-access': 0,
		'@typescript-eslint/no-unsafe-member-return': 0,
		'@typescript-eslint/no-unsafe-return': 0,

		// additional rules to catch dead code
		'no-console': 'warn',
		'no-unreachable': 'error',
		'no-unused-expressions': 'warn',
		'no-unreachable-loop': 'error',
		'no-empty-function': 'warn',
		'no-self-assign': 'warn',
		'no-self-compare': 'warn',
		'no-useless-concat': 'warn',
		'no-useless-return': 'warn',
	},
	overrides: [
		{
			// ensures to also lint these extensions
			files: ['**/*.{c,m}js'],
		},
	],
	// improves performance by ignoring node_modules
	ignorePatterns: [
		'*.css',
		'*.json',
		'*.md',
		'*.sql',
		'*.toml',
		'.next/**',
		'node_modules/**',
		'public/**',
		'LICENSE',
		'pnpm-lock.yaml',
		'types/supabase.ts',
	],
}
