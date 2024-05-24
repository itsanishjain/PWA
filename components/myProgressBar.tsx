interface myProgressBarProps {
	percent: number | undefined
}
const MyProgressBar = (props: myProgressBarProps) => {
	return (
		<div className='flex h-full w-full overflow-hidden rounded-full'>
			<div
				style={{ width: `100%` }}
				className={`barBackground flex h-3 rounded-full md:h-6`}
			>
				<div
					style={{ width: `${props.percent}%` }}
					className={`barForeground flex h-3 rounded-full md:h-6`}
				/>
			</div>
		</div>
	)
}

export default MyProgressBar
