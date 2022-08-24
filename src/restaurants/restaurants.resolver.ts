import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from './../users/entities/user.entity';
import { Restaurant } from './entities/restaurant.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
  EditRestaurantOutput,
  EditRestaurantInput,
  DeleteRestaurantInput,
  DeleteRestaurantOutput
} from './dtos';
import { RestaurantService } from './restaurants.service';
import { AuthUser } from '../auth/auth-user.decorator';
import { Role } from '../auth/role.decorator';

@Resolver(of => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(returns => CreateRestaurantOutput)
  @Role(['Owner'])
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

  @Mutation(returns => EditRestaurantOutput)
  @Role(['Owner'])
  editRestaurant(
    @AuthUser() owner: User,
    @Args('input') editRestaurantInput: EditRestaurantInput
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(owner, editRestaurantInput);
  }

  @Mutation(returns => DeleteRestaurantOutput)
  @Role(['Owner'])
  deleteRestaurant(
    @AuthUser() owner: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.deleteRestaurant(
      owner,
      deleteRestaurantInput
    );
  }
}
