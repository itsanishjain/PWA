import { cache } from 'react'
import { keccak256, toHex } from 'viem'

export const adminRole = cache(() => keccak256(toHex('WHITELISTED_HOST')))
