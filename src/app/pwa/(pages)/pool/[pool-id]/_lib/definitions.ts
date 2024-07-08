import { z } from 'zod'

export enum POOLSTATUS {
    INACTIVE,
    DEPOSIT_ENABLED,
    STARTED,
    ENDED,
    DELETED,
}

// Zod schema definition for PoolDetailsDTO
const PoolDetailsDTOSchema = z.object({
    // Smart contract data
    name: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    claimableAmount: z.number().nonnegative().default(0),
    numParticipants: z.number().int().nonnegative(),
    price: z.number().positive().multipleOf(0.01),
    tokenSymbol: z.string(),
    tokenDecimals: z.number().int().nonnegative(),
    status: z.nativeEnum(POOLSTATUS),
    contractId: z.bigint(),

    // Database data
    imageUrl: z.string().url(),
    winnerTitle: z.string().optional(),
    softCap: z.number().int().positive(),
    description: z.string(),
    termsUrl: z.string().optional().or(z.literal('')),
    hostName: z.string(),
    //TODO: enforce string().url() for terms

    // Mixed data
    participants: z.array(
        z.object({
            name: z.string(),
            avatarUrl: z.string().url(),
        }),
    ),
    // userDeposit: z.number().nonnegative(),

    // Calculated fields
    goal: z.number().positive(),
    progress: z.number().nonnegative(),
})

// Derived type from Zod schema
type PoolDetailsDTO = z.infer<typeof PoolDetailsDTOSchema>

// Function to validate data
function validatePoolDetailsDTO(data: unknown): PoolDetailsDTO {
    return PoolDetailsDTOSchema.parse(data)
}

// Function to partially validate data (useful for partial updates)
function validatePartialPoolDetailsDTO(data: unknown): Partial<PoolDetailsDTO> {
    return PoolDetailsDTOSchema.partial().parse(data)
}

export { PoolDetailsDTOSchema, validatePartialPoolDetailsDTO, validatePoolDetailsDTO }
export type { PoolDetailsDTO }
