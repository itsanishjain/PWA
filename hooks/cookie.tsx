import { jwtExpiryDurationInDays } from '@/constants/constant'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'
import { useEffect, useState } from 'react'

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

export function useCookie() {
	const [currentJwt, setJwt] = useState(getTokenCookie())
	const [isJwtValid, setIsJwtValid] = useState(false)

	const saveJwt = (tokenString: string) => {
		setJwt(tokenString)
		setTokenCookie(tokenString)
	}

	useEffect(() => {
		const tokenString: string = currentJwt ?? ''
		const decodedToken: any = jwt.decode(tokenString, { complete: true })
		if (decodedToken !== null) {
			const expirationTimestamp = decodedToken.exp as number
			const currentTimestamp = Math.floor(Date.now() / 1000)

			if (currentTimestamp > expirationTimestamp) {
				setIsJwtValid(false)
			} else {
				setIsJwtValid(true)
			}
		} else {
			setIsJwtValid(false)
		}
	}, [currentJwt])

	return { currentJwt, saveJwt, isJwtValid }
}
