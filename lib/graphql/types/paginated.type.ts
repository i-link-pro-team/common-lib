import { Type } from '@nestjs/common'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Paginated } from '../../interfaces/paginated.interface'

export const PaginatedType = <T>(classRef: Type<T>): Type<Paginated<T>> => {
    @ObjectType({ isAbstract: true })
    class PaginatedType {
        @Field(() => [classRef])
        nodes: T[]

        @Field(() => Int)
        cursor: number

        @Field(() => Int)
        count: number
    }

    return PaginatedType
}
