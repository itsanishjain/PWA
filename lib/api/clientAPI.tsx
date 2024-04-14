export interface addressObject {
	address: string
}

export interface backendLoginObject {
	address: string
	message: string
	signedMessage: string
	nonce: string
}

export async function fetchNonce(address: addressObject) {
	try {
		const response = await fetch('/api/nonce', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(address),
		})
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		const data = await response.json()
		return data
	} catch (error) {
		console.error('There was a problem with the fetch operation:', error)
	}
}

export async function fetchToken(backendLoginObj: backendLoginObject) {
	try {
		const response = await fetch('/api/backend_login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(backendLoginObj),
		})
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		const data = await response.json()
		return data
	} catch (error) {
		console.error('There was a problem with the fetch operation:', error)
	}
}
