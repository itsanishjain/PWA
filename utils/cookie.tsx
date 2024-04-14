import { jwtExpiryDurationInDays } from '@/constants/constant'
import Cookies from 'js-cookie'

export function getTokenCookie(): string | undefined {
	return Cookies.get('token')
}

export function setTokenCookie(token: string) {
	Cookies.set('token', token, {
		expires: jwtExpiryDurationInDays, // Cookie will expire in 7 days
		sameSite: 'strict', // Set the SameSite attribute
		secure: process.env.NODE_ENV === 'production', // Set the secure flag based on the environment
		path: '/', // Set the path for the cookie
	})
}

export function removeTokenCookie() {
	Cookies.remove('token')
}
