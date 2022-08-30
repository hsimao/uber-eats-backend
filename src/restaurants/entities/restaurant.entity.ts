import { Order } from './../../orders/entities/order.entity';
import { Dish } from './dish.entity';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from '../../common/entities/core.entity';
import { User } from '../../users/entities';
import { Column, Entity, ManyToOne, RelationId, OneToMany } from 'typeorm';
import { Category } from './category.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field(type => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field(type => String)
  @Column()
  @IsString()
  coverImage: string;

  @Field(type => String)
  @Column()
  @IsString()
  address: string;

  // 分類
  @Field(type => Category, { nullable: true })
  @ManyToOne(type => Category, category => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  category: Category;

  // 創建者
  @Field(type => User)
  @ManyToOne(type => User, user => user.restaurants, {
    onDelete: 'CASCADE'
  })
  owner: User;

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;

  // 關聯菜單
  @Field(type => [Dish])
  @OneToMany(type => Dish, dish => dish.restaurant)
  menu: Dish[];

  // 關聯訂單
  @Field(type => [Order])
  @OneToMany(type => Order, order => order.customer)
  orders: Order[];
}
