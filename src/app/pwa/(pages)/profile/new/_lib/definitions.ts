import { z } from 'zod'

// const MAX_FILE_SIZE = 5_000_000 // 5MB
// const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const CreateProfileFormSchema = z.object({
    displayName: z
        .string()
        .min(5, 'The name must have at least 5 characters')
        .max(50, 'The name cannot have more than 50 characters')
        .optional(),
    avatar: z.string().optional(),
    // .instanceof(File)
    // .refine(file => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    // .refine(
    //     file => ACCEPTED_IMAGE_TYPES.includes(file?.type),
    //     'Only .jpg, .jpeg, .png and .webp formats are supported.',
    // )
    // .optional(),
})
