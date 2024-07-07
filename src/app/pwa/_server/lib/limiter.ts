export class ActionError<T extends string> extends Error {
    name: T
    message: string

    constructor(name: T, message: string) {
        super(message)
        this.name = name
        this.message = message
    }
}

const trackers: Record<
    string,
    {
        count: number
        expireAt: number
    }
> = {}

export async function rateLimitByKey(key: string, limit: number = 1, expire: number = 10000) {
    if (!key) throw new Error('Key is required')
    const tracker = trackers[key] || { count: 0, expireAt: 0 }

    if (!trackers[key]) {
        trackers[key] = tracker
    }

    if (tracker.expireAt < Date.now()) {
        tracker.count = 0
        tracker.expireAt = Date.now() + expire
    }

    tracker.count++

    if (tracker.count > limit) {
        throw new ActionError('TOO_MANY_REQUESTS', 'Rate limit exceeded')
    }
}
