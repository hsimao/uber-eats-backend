import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantResolver, CategoryResolver } from './restaurants.resolver';
import { Restaurant, Category } from './entities';
import { RestaurantService } from './restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Category])],
  providers: [RestaurantResolver, CategoryResolver, RestaurantService]
})
export class RestaurantsModule {}
