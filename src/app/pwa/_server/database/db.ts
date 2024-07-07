import 'server-only'

import type { Database } from '@/types/db'
import { createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function createServiceClient() {
    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase URL or service key')
    }

    return createServerClient<Database>(supabaseUrl, supabaseServiceKey, { cookies: {} })
}

export const db = createServiceClient()
