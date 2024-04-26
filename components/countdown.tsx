import { formatCountdownTime } from '@/lib/utils'
import React, { useState, useEffect } from 'react'

const CountdownTimer = ({ initialTime }: { initialTime: number }) => {
	const [timeRemaining, setTimeRemaining] = useState<number>(initialTime)

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTimeRemaining((prevTime) => prevTime - 1)
		}, 1000)

		return () => clearInterval(intervalId)
	}, [])
	return <div>{formatCountdownTime(timeRemaining)}</div>
}

export default CountdownTimer
