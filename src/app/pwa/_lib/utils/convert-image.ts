// TODO: use to save images in the store
export async function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
            if (typeof fileReader.result === 'string') {
                resolve(fileReader.result)
            } else {
                reject('Error converting file to base64')
            }
        }
        fileReader.onerror = error => {
            reject(error)
        }
    })
}
