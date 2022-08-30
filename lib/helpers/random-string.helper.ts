/**
 *
 * @param length how many chars to generate
 * @param onlyNumbers use only numbers
 * @returns string with `length` chars
 */
export const randomString = (length: number, onlyNumbers = false): string => {
    let result = ''
    const characters = onlyNumbers
        ? '0123456789'
        : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        )
    }
    return result
}
