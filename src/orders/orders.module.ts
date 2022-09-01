import { Restaurant } from './../restaurants/entities/restaurant.entity';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Restaurant])],
  providers: [OrdersService, OrdersResolver]
})
export class OrdersModule {}
