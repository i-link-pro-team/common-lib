import { CustomScalar, Scalar } from '@nestjs/graphql'
import { isMobilePhone, isPhoneNumber } from 'class-validator'
import { Kind, ValueNode } from 'graphql'

type PhoneNumber = string

@Scalar('PhoneNumber')
export class PhoneNumberScalar implements CustomScalar<string, PhoneNumber> {
    description = `Phone number custom scalar type`

    parseValue(value: string): PhoneNumber {
        if (isPhoneNumber(value, null) || isMobilePhone(value)) {
            return value
        }

        throw new Error(`value '${value}' is not a phone number.`)
    }

    serialize(value: PhoneNumber): string {
        return value
    }

    parseLiteral(ast: ValueNode): PhoneNumber {
        if (ast.kind === Kind.STRING) {
            if (isPhoneNumber(ast.value, null) || isMobilePhone(ast.value)) {
                return ast.value
            }

            throw new Error(`value '${ast.value}' is not a phone number.`)
        }
        return null
    }
}
