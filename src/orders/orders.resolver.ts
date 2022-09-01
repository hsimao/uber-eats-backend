import { AuthUser } from './../auth/auth-user.decorator';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { User } from './../users/entities/user.entity';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { Role } from 'src/auth/role.decorator';

@Resolver(of => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  // 新增訂單
  @Mutation(returns => CreateOrderOutput)
  @Role(['Client'])
  async createOrder(
    @AuthUser() customer: User,
    @Args('input') createOrderInput: CreateOrderInput
  ): Promise<CreateOrderOutput> {
    return this.ordersService.createOrder(customer, createOrderInput);
  }
}
