import { registerEnumType } from '@nestjs/graphql'

export enum SortOrderEnum {
    ASC = 'ASC',
    DESC = 'DESC',
}

registerEnumType(SortOrderEnum, { name: 'SortOrder' })
