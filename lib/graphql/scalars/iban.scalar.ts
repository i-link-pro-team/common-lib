import { Scalar, CustomScalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'
import { isIBAN } from 'class-validator'

type IBAN = string

@Scalar('IBAN')
export class IBANScalar implements CustomScalar<string, IBAN> {
    description = `
    IBAN custom scalar type, Examples:
    - GR96 0810 0010 0000 0123 4567 890
    - QA54QNBA000000000000693123456
    - ES7921000813610123456789
    more at: https://www.iban.com/structure
    `

    parseValue(value: string): IBAN {
        if (!isIBAN(value)) {
            throw new Error('value is not valid IBAN string')
        }
        return value
    }

    serialize(value: IBAN): string {
        return value
    }

    parseLiteral(ast: ValueNode): IBAN {
        if (ast.kind === Kind.STRING) {
            if (!isIBAN(ast.value)) {
                throw new Error('value is not valid IBAN string')
            }
            return ast.value
        }
        return null
    }
}
