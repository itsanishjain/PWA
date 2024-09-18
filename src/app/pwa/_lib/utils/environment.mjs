import { baseSepolia, base } from 'viem/chains'

const inDevelopment = process.env.NODE_ENV === 'development'
const inProduction = process.env.NODE_ENV === 'production'
const chain = inProduction ? base : baseSepolia

export { inDevelopment, inProduction, chain }
