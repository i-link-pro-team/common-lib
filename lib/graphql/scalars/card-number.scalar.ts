import { Scalar, CustomScalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'
import { isCreditCard } from 'class-validator'

type CardNumber = string

@Scalar('CardNumber')
export class CardNumberScalar implements CustomScalar<string, CardNumber> {
    description = `
    CardNumber custom scalar type, example: 
    - '375556917985515',
    - '36050234196908',
    - '4716461583322103',
    - '4716-2210-5188-5662',
    - '4929 7226 5379 7141',
    - '5398228707871527',
    more at: 
    - https://www.freeformatter.com/credit-card-number-generator-validator.html
    `

    parseValue(value: string): CardNumber {
        if (!isCreditCard(value)) {
            throw new Error('value is not valid card number.')
        }
        return value
    }

    serialize(value: CardNumber): string {
        return value
    }

    parseLiteral(ast: ValueNode): CardNumber {
        if (ast.kind === Kind.STRING) {
            if (!isCreditCard(ast.value)) {
                throw new Error('value is not valid card number.')
            }
            return ast.value
        }
        return null
    }
}
