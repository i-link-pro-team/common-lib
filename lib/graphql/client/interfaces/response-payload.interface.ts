export interface ResponsePayload<T> {
    data: T
    errors?: { message: string }[]
}
