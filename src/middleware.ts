import { NextRequest, NextResponse } from 'next/server'

export default function middleware(req: NextRequest) {
    console.info('\x1b[35m[middleware]\x1b[0m', '🦩\t', '\x1b[36m' + req.nextUrl.pathname + '\x1b[0m')

    return NextResponse.next()
}

export const config = {
    // matcher: '/disabled',
    matcher: ['/((?!api|_next|static|public|favicon.ico|app/assets).*)'],
}
