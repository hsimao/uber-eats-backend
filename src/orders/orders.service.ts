import { Restaurant } from './../restaurants/entities/restaurant.entity';
import { User } from './../users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { Order } from './entities/order.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>
  ) {}

  // 新增訂單
  async createOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput
  ): Promise<CreateOrderOutput> {
    const restaurant = await this.restaurant.findOne({
      where: { id: restaurantId }
    });

    if (!restaurant) {
      return { ok: false, error: 'Restaurant not found' };
    }

    return { ok: true };
  }
}
