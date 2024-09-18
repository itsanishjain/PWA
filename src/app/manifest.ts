import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Pool App',
        short_name: 'Pool',
        description: 'Pool Party! 🏖️',
        categories: ['events', 'fun', 'games', 'lifestyle', 'social'],
        lang: 'en',
        start_url: '/',
        scope: '/',
        id: '/',
        display: 'standalone',
        display_override: ['standalone'],
        background_color: '#2F44A0',
        theme_color: '#fff',
        orientation: 'portrait',
        screenshots: [
            {
                src: '/app/images/screenshot-wide.png',
                type: 'image/png',
                sizes: '1024x768',
            },
            {
                src: '/app/images/screenshot-portrait.png',
                type: 'image/png',
                sizes: '768x1024',
            },
        ],
        protocol_handlers: [
            {
                protocol: 'web+pool',
                url: '/?poolId=%s',
            },
        ],
        serviceworker: {
            src: '/sw.js',
            scope: '/',
        },
        icons: [
            {
                src: '/app/assets/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/app/assets/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}