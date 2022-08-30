import { ValueTransformer } from 'typeorm'
import { BigNumber } from 'bignumber.js'

// TODO: if omitted `toString()` method will use 10, do we need explicit base here?
const DEFAULT_BASE = 10

export class BigNumberFieldTransformer implements ValueTransformer {
    to(value: BigNumber): string {
        if (value) {
            return value.toString(DEFAULT_BASE)
        }

        return '0'
    }

    from(value: string): BigNumber {
        if (value) {
            return new BigNumber(value)
        }

        return new BigNumber('0')
    }
}
