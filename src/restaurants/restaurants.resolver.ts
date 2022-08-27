import { Category } from './entities/category.entity';
import {
  Query,
  Args,
  Mutation,
  Resolver,
  ResolveField,
  Parent
} from '@nestjs/graphql';
import { User } from './../users/entities/user.entity';
import { Restaurant } from './entities/restaurant.entity';
import {
  RestaurantsOutput,
  RestaurantsInput,
  CreateRestaurantInput,
  CreateRestaurantOutput,
  EditRestaurantOutput,
  EditRestaurantInput,
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
  AllCategoriesOutput,
  CategoryInput,
  CategoryOutput
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

  @Query(returns => RestaurantsOutput)
  restaurants(
    @Args('input') restaurantsInput: RestaurantsInput
  ): Promise<RestaurantsOutput> {
    return this.restaurantService.allRestaurants(restaurantsInput);
  }
}

@Resolver(of => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ResolveField(type => Number)
  restaurantCount(@Parent() category: Category): Promise<Number> {
    return this.restaurantService.countRestaurant(category);
  }

  @Query(type => AllCategoriesOutput)
  allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantService.allCategories();
  }

  @Query(type => CategoryOutput)
  category(
    @Args('input') categoryInput: CategoryInput
  ): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryBySlug(categoryInput);
  }
}
