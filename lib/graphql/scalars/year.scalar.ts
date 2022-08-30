import { Scalar, CustomScalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'

const YEAR_CHAR_COUNT = 4

@Scalar('FullYear')
export class FullYearScalar implements CustomScalar<string, string> {
    description = 'FullYear custom scalar type'

    parseValue(value: string): string {
        if (!validateYear(value)) {
            throw new Error(`value '${value} is not valid year value.`)
        }

        return value // value from the client
    }

    serialize(value: string): string {
        return validateYear(value) ? value : null // value sent to the client
    }

    parseLiteral(ast: ValueNode): string {
        if (ast.kind === Kind.STRING) {
            if (!validateYear(ast.value)) {
                throw new Error(`value '${ast.value} is not valid year value.`)
            }

            return ast.value
        }
        return null
    }
}

const validateYear = (input: string): boolean => {
    const yearRegExp = new RegExp(/(19[5-9]\d|20[0-4]\d|2050)/)
    if (yearRegExp.test(input) && input.length === YEAR_CHAR_COUNT) {
        return true
    }
    return false
}
