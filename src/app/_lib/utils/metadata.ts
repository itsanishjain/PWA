import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
    userScalable: false,
    viewportFit: 'cover',
    initialScale: 1,
    width: 'device-width',
    themeColor: [
        { media: '(prefers-color-scheme: dark)', color: '#fff' },
        { media: '(prefers-color-scheme: light)', color: '#18181b' },
    ],
}

const APP_NAME = 'Pool'
const APP_DEFAULT_TITLE = 'Pool App'
const APP_TITLE_TEMPLATE = '%s - Pool'
const APP_DESCRIPTION = 'Pool Party! 🏖️'

export const metadata: Metadata = {
    ...(process.env.NODE_ENV === 'production' ? { metadataBase: new URL('https://app.poolparty.cc') } : {}),
    icons: {
        icon: '/app/assets/favicon.png',
        apple: '/app/assets/icon-maskable-512.png',
    },
    // // TODO: correct this
    manifest: process.env.NODE_ENV === 'production' ? '/manifest.json' : undefined,
    // applicationName: APP_NAME,
    // title: {
    //     default: APP_DEFAULT_TITLE,
    //     template: APP_TITLE_TEMPLATE,
    // },
    // description: APP_DESCRIPTION,
    // appleWebApp: {
    //     capable: true,
    //     statusBarStyle: 'default',
    //     title: APP_DEFAULT_TITLE,
    //     // startUpImage: [],
    // },
    // formatDetection: {
    //     telephone: false,
    // },
    // openGraph: {
    //     type: 'website',
    //     siteName: APP_NAME,
    //     title: {
    //         default: APP_DEFAULT_TITLE,
    //         template: APP_TITLE_TEMPLATE,
    //     },
    //     description: APP_DESCRIPTION,
    // },
    // twitter: {
    //     card: 'app',
    //     title: {
    //         default: APP_DEFAULT_TITLE,
    //         template: APP_TITLE_TEMPLATE,
    //     },
    //     description: APP_DESCRIPTION,
    // },
}
