import { CoreOutput } from './../../common/dtos/output.dto';
import { InputType, PickType, ObjectType, Field } from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
  'name',
  'coverImage',
  'address'
]) {
  @Field(type => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
