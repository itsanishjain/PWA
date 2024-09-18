'use client'
// QueryClientProvider relies on useContext under the hood. It needs to be a client component.

import { defaultShouldDehydrateQuery, isServer, QueryClient } from '@tanstack/react-query'
import type { PersistedClient, Persister, PersistQueryClientProviderProps } from '@tanstack/react-query-persist-client'
import { hashFn } from 'wagmi/query'
import { serialize } from 'wagmi'
import { del, get, set } from 'idb-keyval'
import { throttle } from 'lodash'

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                queryKeyHashFn: hashFn,
                networkMode: 'online',
                gcTime: 86_400_000, // 24 hours
                // With SSR, we usually want to set some default staleTime
                // above 0 to avoid refetching immediately on the client
                staleTime: 60_000, // 1 minute
            },
            mutations: {
                networkMode: 'always',
            },
            dehydrate: {
                // include pending queries in dehydration
                shouldDehydrateQuery: query => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
            },
        },
    })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
    if (isServer) {
        // Server: always make a new query client
        return makeQueryClient()
    } else {
        // Browser: make a new query client if we don't already have one
        // This is very important so we don't re-make a new client if React
        // suspends during the initial render. This may not be needed if we
        // have a suspense boundary BELOW the creation of the query client
        if (!browserQueryClient) browserQueryClient = makeQueryClient()
        return browserQueryClient
    }
}

function createIDBPersister(idbValidKey: IDBValidKey = 'reactQuery'): Persister {
    return {
        persistClient: throttle(async (client: PersistedClient) => {
            await set(idbValidKey, JSON.parse(serialize(client)))
        }, 1000),
        restoreClient: async () => {
            return get(idbValidKey)
        },
        removeClient: async () => {
            await del(idbValidKey)
        },
    }
}

export default function getQueryClientConfig(): PersistQueryClientProviderProps {
    return {
        client: getQueryClient(),
        persistOptions: {
            persister: createIDBPersister('pool.cache'),
            dehydrateOptions: {
                shouldDehydrateQuery: query =>
                    query.gcTime !== 0 && query.queryHash !== JSON.stringify([{ entity: 'signer' }]),
            },
            buster: process.env.CONFIG_BUILD_ID,
        },
    }
}
