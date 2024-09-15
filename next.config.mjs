// @ts-check
import bundleAnalyzer from '@next/bundle-analyzer'
import withSerwistInit from '@serwist/next'
import { inProduction } from './src/app/_lib/utils/environment.mjs'
import { execSync } from 'node:child_process'

const turboEnabled = process.env.TURBO === 'true'

const withSerwist = withSerwistInit({
    swSrc: 'src/app/_lib/utils/sw.ts',
    swDest: 'public/sw.js',
    disable: !inProduction,
    scope: '/',
    cacheOnNavigation: true,
})

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
export default withBundleAnalyzer(
    withSerwist({
        eslint: { ignoreDuringBuilds: true },
        ...(turboEnabled ? {} : { compiler: { removeConsole: inProduction } }),
        experimental: {
            typedRoutes: !inProduction && !turboEnabled,
            ...(turboEnabled ? { turbo: { useSwcCss: true } } : {}),
            serverActions: {
                allowedOrigins: ['app.poolparty.cc'],
            },
        },
        reactStrictMode: !inProduction,
        images: {
            remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
        },
        generateBuildId: () => {
            const hash = execSync('git rev-parse HEAD').toString().trim()
            return hash
        },
        webpack: (config, options) => {
            // Exclude *.test.ts(x) files from being compiled by Next.js
            config.module.rules.push({
                test: /\.test\.tsx?$/,
                use: 'ignore-loader',
            })
            config.plugins.push(
                new options.webpack.DefinePlugin({
                    'process.env.CONFIG_BUILD_ID': JSON.stringify(options.buildId),
                }),
            )
            return config
        },
    }),
)
