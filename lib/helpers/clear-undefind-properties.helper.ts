export const clearUndefinedProperties = <T>(o: T): T => {
    const copiedObject = { ...(o as Record<string, unknown>) }
    Object.keys(copiedObject).forEach(
        (key) => copiedObject[key] === undefined && delete copiedObject[key],
    )
    return copiedObject as unknown as T
}
