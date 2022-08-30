import { Scalar, CustomScalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'
import { BigNumber } from 'bignumber.js'
import { BadRequestException } from '@nestjs/common'

@Scalar('BigNumber')
export class BigNumberScalar implements CustomScalar<string, BigNumber> {
    description = 'BigNumber custom scalar type'

    parseValue(value: string): BigNumber {
        return new BigNumber(value) // value from the client
    }

    serialize(value: BigNumber): string {
        return value.toString() // value sent to the client
    }

    parseLiteral(ast: ValueNode): BigNumber {
        if (ast.kind === Kind.STRING) {
            return new BigNumber(ast.value)
        }
        throw new BadRequestException(
            `Expected string representation of big number, got ${ast.kind}`,
        )
    }
}
