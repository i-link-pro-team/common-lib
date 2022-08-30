export interface RequestConfig {
    name?: string

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers?: any

    log?: boolean

    timeout?: number

    timeoutErrorMessage?: string
}
