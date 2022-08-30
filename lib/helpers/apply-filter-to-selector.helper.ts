import { CommonBaseEntity } from '../typeorm/entities/common-base-entity.entity'
import { FindConditions, FindManyOptions, In } from 'typeorm'

interface FilterDto {
    ids?: string[]
    skip?: number
    limit?: number
}

/**
 *
 * @param entityFieldsSelector object with entity related fields to filter by
 * @param filter objects with `ids`, `take` and `limit`
 * @returns mix of given object, new selector which can be applied to `.find()` method of typeorm repository
 */
export function applyFilterToSelector<T extends CommonBaseEntity>(
    entityFieldsSelector: FindConditions<T> = {}, // if you don't need this parameter you can send {}
    filter?: FilterDto,
): FindManyOptions<T> {
    let ids: string[] | undefined = []
    let skip: number
    let limit: number

    if (filter !== undefined) {
        ;({ ids, skip, limit } = filter)
    }

    const filterFieldsSelector: FindConditions<CommonBaseEntity> = {}
    if (ids?.length) {
        filterFieldsSelector.id = In(ids)
    }

    return {
        where: { ...entityFieldsSelector, ...filterFieldsSelector },
        take: limit,
        skip,
    }
}
