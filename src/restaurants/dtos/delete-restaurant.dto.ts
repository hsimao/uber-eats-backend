import { CoreOutput } from '../../common/dtos/output.dto';
import { InputType, ObjectType, Field } from '@nestjs/graphql';

@InputType()
export class DeleteRestaurantInput {
  @Field(type => Number)
  restaurantId: number;
}

@ObjectType()
export class DeleteRestaurantOutput extends CoreOutput {}
