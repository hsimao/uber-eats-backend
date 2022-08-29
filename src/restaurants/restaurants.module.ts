import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  RestaurantResolver,
  CategoryResolver,
  DishResolver
} from './restaurants.resolver';
import { Restaurant, Category, Dish } from './entities';
import { RestaurantService } from './restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Category, Dish])],
  providers: [
    RestaurantResolver,
    CategoryResolver,
    DishResolver,
    RestaurantService
  ]
})
export class RestaurantsModule {}
