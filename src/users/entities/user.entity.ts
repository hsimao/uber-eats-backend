import { Order } from './../../orders/entities/order.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import {
  Field,
  ObjectType,
  InputType,
  registerEnumType
} from '@nestjs/graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';

export enum UserRole {
  Owner = 'Owner',
  Client = 'Client',
  Delivery = 'Delivery'
}

// 將 UserRole enum 註冊到 graphql 上, playground 才會正常顯示
registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field(type => String)
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(type => UserRole) // enum type 需要透過 registerEnumType 註冊才能使用
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field(type => Boolean)
  @IsBoolean()
  verified: boolean;

  // 關聯自己創建的餐廳
  @Field(type => [Restaurant])
  @OneToMany(type => Restaurant, restaurant => restaurant.owner)
  restaurants: Restaurant[];

  // 一般用戶關聯訂單
  @Field(type => [Order])
  @OneToMany(type => Order, order => order.customer)
  orders: Order[];

  // 司機關聯訂單
  @Field(type => [Order])
  @OneToMany(type => Order, order => order.driver)
  rides: Order[];

  // 儲存到 DB 前先加密 password
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (err) {
        console.log(err);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const isOk = await bcrypt.compare(aPassword, this.password);
      return isOk;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
