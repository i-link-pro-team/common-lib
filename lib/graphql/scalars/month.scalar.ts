import { Scalar, CustomScalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'

const MONTH_CHAR_COUNT = 2

@Scalar('Month')
export class MonthScalar implements CustomScalar<string, string> {
    description = 'Month custom scalar type'

    parseValue(value: string): string {
        if (!validateMonth(value)) {
            throw new Error(`value '${value} is not valid year value.`)
        }

        return value // value from the client
    }

    serialize(value: string): string {
        return validateMonth(value) ? value : null // value sent to the client
    }

    parseLiteral(ast: ValueNode): string {
        if (ast.kind === Kind.STRING) {
            if (!validateMonth(ast.value)) {
                throw new Error(`value '${ast.value} is not valid year value.`)
            }

            return ast.value
        }
        return null
    }
}

const validateMonth = (input: string): boolean => {
    const monthRegExp = new RegExp(/0[1-9]|1[0-2]/)
    if (monthRegExp.test(input) && input.length === MONTH_CHAR_COUNT) {
        return true
    }
    return false
}
