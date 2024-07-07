interface Props {
    _title?: string
}

export default function Page({ _title, children }: React.PropsWithChildren<Props>) {
    return (
        <>
            {/* {title ? (
			<Head>
				<title>Rice Bowl | {title}</title>
			</Head>
		) : null}

		<Appbar /> */}

            <main
                /**
                 * Padding top = `appbar` height
                 * Padding bottom = `bottom-nav` height
                 */
                className='mx-auto h-screen max-w-screen-md pb-16 px-safe sm:pb-0'>
                <div className='h-full p-6'>{children}</div>
            </main>

            {/* <BottomNav /> */}
        </>
    )
}
