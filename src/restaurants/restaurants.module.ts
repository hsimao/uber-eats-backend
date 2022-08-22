import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantResolver } from './restaurants.resolver';
import { Restaurant, Category } from './entities';
import { RestaurantService } from './restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Category])],
  providers: [RestaurantResolver, RestaurantService]
})
export class RestaurantsModule {}
