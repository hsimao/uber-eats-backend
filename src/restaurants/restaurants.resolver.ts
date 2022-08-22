import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from './../users/entities/user.entity';
import { Restaurant } from './entities/restaurant.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput
} from './dtos/create-restaurant.dto';
import { RestaurantService } from './restaurants.service';
import { AuthUser } from '../auth/auth-user.decorator';

@Resolver(of => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(returns => CreateRestaurantOutput)
  async createRestaurant(
    @AuthUser()
    authUser: User,
    @Args('input')
    createRestaurantInput: CreateRestaurantInput
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.createRestaurant(
      authUser,
      createRestaurantInput
    );
  }
}
