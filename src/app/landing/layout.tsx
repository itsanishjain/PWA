import { comfortaa, inter } from '@/lib/utils/fonts'
import './_styles/landing-styles.css'

export const metadata = {
    title: 'Pool Party',
    description: 'Pooling funds made simple',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en' className='h-full motion-safe:scroll-smooth'>
            <body className={`${(inter.variable, comfortaa.variable)}`}>{children}</body>
        </html>
    )
}
