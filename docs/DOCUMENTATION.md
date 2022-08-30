# Documentation

## Exception Filters

### [CommonExceptionFilter](https://github.com/i-link-pro-team/common-lib/lib/exception-filters/common.exception-filter.ts)

Exception filters allow us not to use `try / catch` as often as we do now, and to handle them within the same class (like the error aggregator class). Find out more here:

* <https://docs.nestjs.com/exception-filters>
* <https://docs.nestjs.com/graphql/other-features#exception-filters>


## Interceptors

### [LoggingInterceptor](https://github.com/i-link-pro-team/common-lib/lib/interceptors/logging.interceptor.ts)

An interceptor that logs request/response, the execution time of the function, the name of the methods that were executed, headers. Suitable for debug mode, when the service is already in dev. Retrieves the x-request-id if passed in the header. You can turn on / off some functions: headers, request, response, handlers


```typescript
// .env
LOGGING_INTERCEPTOR_MODES = request, headers, handlers, response

// main.ts
async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule)

    const configService = app.get(ConfigService)

    const interceptorModes = configService.get<string>('LOGGING_INTERCEPTOR_MODES') || ''

    app.useGlobalInterceptors(
        new LoggingInterceptor({ modes: interceptorModes.split(',') })
    )

    await app.listen(port, hostname, () =>
        logger.log(`Server running at ${hostname}:${port}`),
    )
}
```


## GraphQL

### [GraphQL HTTP Client](https://github.com/i-link-pro-team/common-lib/lib/graphql/client/graphql-client.service.ts )

The service provides methods for sending GQL queries over HTTP. Benefits of using:

* Ability to type server responses
* Single sendQuery method for sending requests
* Ease of injection into other projects
* Ability to log GQL queries to the console


```javascript
@Injectable()
export class CatService extends GraphQLClientService {

    constructor(private readonly _configService: ConfigService) {
        super(_configService.get<string>('CAT_API_URL'))
    }

    async sendCats(query: string): Promise<CatResponse> {
        return await this._sendQuery(query, {
            headers: {
                authorization: 'my-cat-token'
            }
            log: true, // prints a GQL query to the console
            name: 'sendCats' // prints '[sendCats] request sent to http://localhost:3000/graphql' to the console
        })
    }
}
```

### [SortOrderEnum](https://github.com/i-link-pro-team/common-lib/lib/graphql/enums/sort-order.enum.ts)

When implementing sorting, it is very often necessary to implement ascending/descending sorting. **SortOrderEnum** contains two values ​​**ASC** and **DESC**, it can be used in GQL inputs and inserted into typeorm sort fields.

### [FilterInput](https://github.com/i-link-pro-team/common-lib/lib/graphql/inputs/filter.input.ts)

GQL Input is often used when filtering needs to be implemented. The main fields for filtering are ids, skip, limit. FilterInput implements them, and sets **default values**.


```javascript
import { Field, ID, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CatInput extends FilterInput {
    @Field(() => BlockchainEnum, { nullable: true })
    blockchain?: BlockchainEnum

    @Field(() => TokenEnum, { nullable: true })
    token?: TokenEnum
}
```

### [Scalars](https://gitlab.i-link.pro/i-link/i-link-common/-/tree/master/lib/graphql/scalars)

Scalars are used to use types not found in GraphQL. For example BigNumber, a type with which it is convenient to work with large numbers. BigNumberScalar takes a string as input and parses it into BigNumber, thus we can validate fields and get rid of unnecessary code

### [PaginatedType](https://github.com/i-link-pro-team/common-lib/lib/graphql/types/paginated.type.ts)

GraphQL type that implements pagination. With it, not all essences can be given to the front, but only a certain part. Using skip and limit, you can get from

features “page by page”.


```javascript
@ObjectType('Balance')
export class BalanceType {
    @Field(() => BigNumberScalar)
    totalSupply: BigNumber

    @Field(() => BigNumberScalar)
    apy: BigNumber

    @Field(() => BigNumberScalar)
    apyChange: BigNumber

    @Field(() => BigNumberScalar)
    collateral: BigNumber

    @Field(() => BigNumberScalar)
    pnl: BigNumber
}

@ObjectType('Balances')
export class BalancesType extends PaginatedType(BalancesType) {}
```

## Helpers

### [clearUndefinedProperties](https://github.com/i-link-pro-team/common-lib/lib/helpers/clear-undefind-properties.helper.ts)

The clearUndefinedProperties function removes fields in an object whose type is **undefined**. It is very often used when you need to send a GQL request, or find entities using a filter, since typeorm does not accept undefined well.


```javascript
async findEntity(filter: Filter): Promise<Entity> {
    const clearedFilter = clearUndefinedProperties(filter)

    return await this._entityRepository.find(clearedFilter)
}
```

### [betweenDates](https://github.com/i-link-pro-team/common-lib/lib/helpers/between-dates.helper.ts)

The betweenDates function is used for filtering in typeorm. Typeorm has its own Between() function, but it doesn't work well with dates. The function parses the date into the correct values ​​and returns `FindOperator`


```typescript
const entities = await this._entityRepository.find({
    where: {
        createdAt: betweenDates(from, to)
    }
})
```

### [randomString](https://github.com/i-link-pro-team/common-lib/lib/helpers/random-string.helper.ts)

Returns a random string of the given length. You can use the `onlyNumbers` flag to get a string of numbers.

### [applyFilterToSelector](https://github.com/i-link-pro-team/common-lib/lib/helpers/apply-filter-to-selector.helper.ts )

Returns an object with the passed fields for filtering. Gets the ids, skip, limit fields and puts them in their places. Returns an object that can be used in entity search methods


```typescript
const findOptions = applyFilterToSelector({}, filter)

const entities = await this._entityRepository.find(findOptions)
```

## Interfaces

### [Paginated](https://github.com/i-link-pro-team/common-lib/lib/interfaces/paginated.interface.ts)

Interface implementing pagination with template type


```javascript
export interface Paginated<T> {
    nodes: T[]
    cursor: number
    count:number
}
```

## TypeORM

### [CommonBaseEntity](https://github.com/i-link-pro-team/common-lib/lib/typeorm/entities/common-base-entity.entity.ts )

Entity implements the main fields in the database, such as id, createdAt, updatedAt, deletedAt, version.


```javascript
export class CatEntity extends CommonBaseEntity {
    @Column()
    name:string
}
```


Result in database

| name | createdAt | updatedAt | deletedAt | version |
|----|----|----|----|----|
| cat | time-here | time-here | NULL | 1 |
| cat2 | time-here | time-here | time-here | 3 |

### [BigNumberFieldTransformer](https://github.com/i-link-pro-team/common-lib/lib/typeorm/transformers/bignumber-field.transformer.ts)

Transformer for typeorm. With it, you can pass BigNumber types to entities, which will be represented in the database in other types (string by default)


```typescript
@Entity('cats')
export class CatEntity extends CommonBaseEntity {
    @Column({
        type: 'decimal', // you can specify another type, but it's better in what to use decimals transformer: new BigNumber Field Transformer(), default: '0', }) age: BigNumber
}
```
        