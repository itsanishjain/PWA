// needs server only because it uses node:child_process and that is not supported in the browser
import 'server-only'

import sharp from 'sharp'

export async function processImage(
    input: string | File | Buffer,
    width: number = 240,
    height: number = 240,
): Promise<Buffer> {
    try {
        let buffer: Buffer

        if (typeof input === 'string') {
            // Handle base64 string
            const base64Data = input.split(',')[1]
            buffer = Buffer.from(base64Data, 'base64')
        } else if (input instanceof File) {
            // Handle File object
            const arrayBuffer = await input.arrayBuffer()
            buffer = Buffer.from(arrayBuffer)
        } else if (Buffer.isBuffer(input)) {
            // Handle Buffer
            buffer = input
        } else {
            throw new Error('Invalid input type')
        }

        const resizedImageBuffer = await sharp(buffer)
            .resize(width, height, { fit: 'cover' })
            .png({ quality: 100 })
            .toBuffer()

        return resizedImageBuffer
    } catch (error) {
        throw new Error('Error processing image: ' + JSON.stringify(error))
    }
}
