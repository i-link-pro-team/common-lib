import { Scalar, CustomScalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'
import { isBIC } from 'class-validator'

type SWIFT = string

@Scalar('SWIFT')
export class SWIFTScalar implements CustomScalar<string, SWIFT> {
    description = `
    SWIFT custom scalar type, example:
    - BUKBGB220KP
    - SBICKEN1345
    - SABRRUMM125
    `

    parseValue(value: string): SWIFT {
        if (!isBIC(value)) {
            throw new Error('value is not a valid SWIFT value.')
        }
        return value
    }

    serialize(value: SWIFT): string {
        return value
    }

    parseLiteral(ast: ValueNode): SWIFT {
        if (ast.kind === Kind.STRING) {
            if (!isBIC(ast.value)) {
                throw new Error('value is not a valid SWIFT value.')
            }
            return ast.value
        }
        return null
    }
}
