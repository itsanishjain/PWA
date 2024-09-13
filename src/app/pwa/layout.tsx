import { Providers } from './_client/providers'
import MainWrapper from './_components/main-wrapper'
import './_styles/app-styles.css'

import { comfortaa, inter } from '@/lib/utils/fonts'

export default function RootLayout({
    topbar,
    children,
    bottombar,
    modal,
}: React.PropsWithChildren<LayoutWithSlots<'topbar' | 'bottombar' | 'modal'>>) {
    return (
        <html lang='en'>
            <head />
            <body className={`${inter.variable} ${comfortaa.variable} flex min-h-screen flex-col`}>
                <Providers>
                    {topbar}
                    <MainWrapper>{children}</MainWrapper>
                    {modal}
                    {bottombar}
                </Providers>
            </body>
        </html>
    )
}
