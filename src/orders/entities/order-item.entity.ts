import { DishOption } from './../../restaurants/entities/dish.entity';
import { Dish } from '../../restaurants/entities/dish.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { User } from '../../users/entities/user.entity';
import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType
} from '@nestjs/graphql';

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
  @ManyToOne(type => Dish, { nullable: true, onDelete: 'CASCADE' })
  dish: Dish;

  @Field(type => [DishOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: DishOption[];
}
