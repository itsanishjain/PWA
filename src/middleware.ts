import { NextRequest, NextResponse } from 'next/server'

export default function middleware(req: NextRequest) {
    const response = NextResponse.next()

    console.info('\x1b[35m[middleware]\x1b[0m', '🦩\t', '\x1b[36m' + req.nextUrl.pathname + '\x1b[0m')

    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    response.headers.set('X-XSS-Protection', '1; mode=block')

    return response
}

export const config = {
    // matcher: '/disabled',
    matcher: ['/((?!api|_next|static|public|favicon.ico|app/assets).*)'],
}
