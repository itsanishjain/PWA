interface Props {
	title?: string
	children: React.ReactNode
}

const Page = ({ children }: Props) => (
	<main
		/**
		 * Padding top = `appbar` height
		 * Padding bottom = `bottom-nav` height
		 */
		className='mx-auto h-screen max-w-screen-md pb-16 px-safe sm:pb-0'
	>
		<div className='h-full p-6'>{children}</div>
	</main>
)

export default Page
