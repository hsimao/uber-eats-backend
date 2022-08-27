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
  RestaurantInput,
  RestaurantOutput,
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

// 餐廳
@Resolver(of => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  // 新增餐廳
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

  // 編輯餐廳
  @Mutation(returns => EditRestaurantOutput)
  @Role(['Owner'])
  editRestaurant(
    @AuthUser() owner: User,
    @Args('input') editRestaurantInput: EditRestaurantInput
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(owner, editRestaurantInput);
  }

  // 刪除餐廳
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

  // 所有餐廳
  @Query(returns => RestaurantsOutput)
  restaurants(
    @Args('input') restaurantsInput: RestaurantsInput
  ): Promise<RestaurantsOutput> {
    return this.restaurantService.allRestaurants(restaurantsInput);
  }

  // 搜尋餐廳 by id
  @Query(returns => RestaurantOutput)
  restaurant(
    @Args('input') restaurantInput: RestaurantInput
  ): Promise<RestaurantOutput> {
    return this.restaurantService.findRestaurantById(restaurantInput);
  }
}

// 分類
@Resolver(of => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  // 取得相同分類餐廳數量
  @ResolveField(type => Number)
  restaurantCount(@Parent() category: Category): Promise<Number> {
    return this.restaurantService.countRestaurant(category);
  }

  // 所有分類
  @Query(type => AllCategoriesOutput)
  allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantService.allCategories();
  }

  // 搜尋分類 by slug
  @Query(type => CategoryOutput)
  category(
    @Args('input') categoryInput: CategoryInput
  ): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryBySlug(categoryInput);
  }
}
