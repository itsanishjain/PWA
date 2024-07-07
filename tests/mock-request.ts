// // src/lib/tests/mock-request.ts
// import type { NextRequest } from 'next/server'

// export function createMockedRequest(
//     options: {
//         pathname?: string
//         cookies?: { [key: string]: string }
//     } = {},
// ) {
//     const req = {
//         nextUrl: { pathname: options.pathname || '/' },
//         cookies: {
//             get: (name: string) => ({ value: options.cookies?.[name] }),
//         },
//     } as unknown as NextRequest

//     return { req }
// }
