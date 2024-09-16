import { NextResponse } from 'next/server'
import { verifyToken } from '@/app/_server/auth/privy'
import { isAdminUseCase } from '@/app/_server/use-cases/users/is-admin'

export async function GET() {
    try {
        const user = await verifyToken()
        if (!user || !user.wallet?.address) {
            return NextResponse.json({ isAdmin: false }, { status: 401 })
        }

        const isAdmin = await isAdminUseCase(user?.wallet?.address)
        return NextResponse.json({ isAdmin })
    } catch (error) {
        console.error('Error validating admin status:', error)
        return NextResponse.json({ isAdmin: false }, { status: 500 })
    }
}
