import {
  PaginationInput,
  PaginationOutput
} from './../../common/dtos/pagination.dto';
import { Restaurant } from './../entities/restaurant.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class SearchRestaurantInput extends PaginationInput {
  @Field(type => String)
  query: string;
}

@ObjectType()
export class SearchRestaurantOutput extends PaginationOutput {
  @Field(type => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];
}
