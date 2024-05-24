/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa'

const nextPWAConfig = {
	disable: process.env.NODE_ENV === 'development',
	dest: 'public',
	register: true,
	skipWaiting: true,
}

const withPWAConfig = withPWA(nextPWAConfig)

module.exports = withPWAConfig({
	reactStrictMode: true,
})
