export interface Paginated<T> {
    nodes: T[]
    cursor: number
    count: number
}
