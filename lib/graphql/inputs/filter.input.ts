import { Field, ID, InputType, Int } from '@nestjs/graphql'
import { IsOptional, IsUUID, Min } from 'class-validator'

@InputType('Filter')
export class FilterInput {
    @IsOptional()
    @IsUUID('all', { each: true })
    @Field(() => [ID], { nullable: 'itemsAndList' })
    ids?: string[]

    @IsOptional()
    @Min(0)
    @Field(() => Int, { defaultValue: 0, nullable: true })
    skip?: number

    @IsOptional()
    @Min(1)
    @Field(() => Int, { defaultValue: 20, nullable: true })
    limit?: number
}
