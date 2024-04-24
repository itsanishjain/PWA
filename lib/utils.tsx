export const formatTimeDiff = (diffInMs: number) => {
	const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
	const hours = Math.floor(
		(diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
	)
	const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60))

	return { days, hours, minutes }
}
