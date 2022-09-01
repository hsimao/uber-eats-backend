import { Dish } from './../../restaurants/entities/dish.entity';
import { Restaurant } from './../../restaurants/entities/restaurant.entity';
import { User } from './../../users/entities/user.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType
} from '@nestjs/graphql';

export enum OrderStatus {
  Pending = 'Pending', // 下訂中
  Cooking = 'Cooking', // 料理中
  PickedUp = 'PickedUp', // 取餐
  Delivered = 'Delivered' // 送達
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  // 訂餐者
  @Field(type => User, { nullable: true })
  @ManyToOne(type => User, user => user.orders, {
    onDelete: 'SET NULL',
    nullable: true
  })
  customer?: User;

  // 送餐者
  @Field(type => User, { nullable: true })
  @ManyToOne(type => User, user => user.rides, {
    onDelete: 'SET NULL',
    nullable: true
  })
  driver?: User;

  // 餐廳
  @Field(type => Restaurant)
  @ManyToOne(type => Restaurant, restaurant => restaurant.orders, {
    onDelete: 'SET NULL',
    nullable: true
  })
  restaurant: Restaurant;

  // 餐點
  @Field(type => [Dish])
  @ManyToMany(type => Dish)
  @JoinTable() // 可從訂單中看到菜單
  dishes: Dish[];

  // 訂單總金額
  @Field(type => Number, { nullable: true })
  @Column({ nullable: true })
  total?: number;

  // 訂單狀態
  @Field(type => OrderStatus)
  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;
}
