import { CoreOutput } from './../../common/dtos/output.dto';
import { Restaurant } from './../entities/restaurant.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class RestaurantInput {
  @Field(type => Number)
  restaurantId: number;
}

@ObjectType()
export class RestaurantOutput extends CoreOutput {
  @Field(type => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
