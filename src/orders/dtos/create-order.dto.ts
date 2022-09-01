import { DishOption } from './../../restaurants/entities/dish.entity';
import { CoreOutput } from './../../common/dtos/output.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
class CreateOrderItemInput {
  @Field(type => Number)
  dishId: number;

  @Field(type => DishOption, { nullable: true })
  options?: DishOption[];
}

@InputType()
export class CreateOrderInput {
  @Field(type => Number)
  restaurantId: number;

  @Field(type => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {}
