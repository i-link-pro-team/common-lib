import { format, parseISO } from 'date-fns'
import {
    Between,
    FindOperator,
    LessThanOrEqual,
    MoreThanOrEqual,
} from 'typeorm'

const dateFormat = 'yyyy-MM-dd HH:mm:ss.SSS'

/**
 *
 * @param from date from which to search
 * @param to date up to which to search
 * @returns find operator than can be applied to `.find()` method of typeorm repository
 *
 * @example
 * const betweenDatesOperator = betweenDates(from, to)
 * const document = await this._repository.find({
 *     where: {
 *         createdAt: betweenDatesOperator
 *     }
 * })
 */
export const betweenDates = (from?: Date, to?: Date): FindOperator<string> => {
    if (from && to) {
        return Between(
            format(parseISO(from.toISOString()), dateFormat),
            format(parseISO(to.toISOString()), dateFormat),
        )
    }

    if (!from && to) {
        return LessThanOrEqual(format(parseISO(to.toISOString()), dateFormat))
    }

    if (from && !to) {
        return MoreThanOrEqual(format(parseISO(from.toISOString()), dateFormat))
    }

    throw new Error('`from` and `to` are both null')
}

/**
 * @param field = string representation to which operation gets applied, e.g. `entityAlias.createdAt`
 * @param from date from which to search
 * @param to date up to which to search
 * @returns find string than can be applied to `queryBuilder.where` method of typeorm repository
 *
 * @example
 * const alias = 'entity'
 * const query = this._repository.createQueryBuilder(alias)
 * const findBetweenDatesQuery = betweenDatesQueryBuilder(`${alias}.created_at`, fromDate, toDate)
 * query.andWhere(
 *     findBetweenDatesQuery,
 * )
 */
export const betweenDatesQueryBuilder = (
    field: string,
    from?: Date,
    to?: Date,
): string => {
    if (from && to) {
        return `${field} >= '${format(
            parseISO(from.toISOString()),
            dateFormat,
        )}' and ${field} <= '${format(parseISO(to.toISOString()), dateFormat)}'`
    }

    if (!from && to) {
        return `${field} <= '${format(parseISO(to.toISOString()), dateFormat)}'`
    }

    if (from && !to) {
        return `${field} >= '${format(
            parseISO(from.toISOString()),
            dateFormat,
        )}'`
    }

    throw new Error('`from` and `to` are both null')
}
