import type { Route } from 'next'

export default function getAppUrl(path: string = ''): Route {
    const isDevelopment = process.env.NODE_ENV === 'development'
    const appDomain = isDevelopment ? 'http://app.localhost:3000' : 'https://app.poolparty.cc'
    return `${appDomain}${path}`
}
