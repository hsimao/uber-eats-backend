import { CoreOutput } from './output.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(type => Number, { defaultValue: 1 })
  page: number;

  @Field(type => Number, { defaultValue: 25 })
  limit: number;
}

@ObjectType()
export class PaginationOutput extends CoreOutput {
  @Field(type => Number, { nullable: true })
  totalPages?: number;

  @Field(type => Number, { nullable: true })
  totalResults?: number;
}
