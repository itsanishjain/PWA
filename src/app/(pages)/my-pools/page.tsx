/**
 * @file src/app/my-pools/page.tsx
 * @description This file initiates the participant pools page rendering.
 */

import MyPools from './_components/my-pools'
import { getMyPoolsPageAction } from './actions'

export default async function MyPoolsPage() {
    const { upcomingPools, pastPools } = await getMyPoolsPageAction()

    return <MyPools initialUpcomingPools={upcomingPools} initialPastPools={pastPools} />
}
