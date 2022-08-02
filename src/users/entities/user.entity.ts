import {
  Field,
  ObjectType,
  InputType,
  registerEnumType
} from '@nestjs/graphql';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

enum UserRole {
  Owner,
  Client,
  Delivery
}

// 將 UserRole enum 註冊到 graphql 上, playground 才會正常顯示
registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field(type => String)
  email: string;

  @Column()
  @Field(type => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(type => UserRole) // enum type 需要透過 registerEnumType 註冊才能使用
  role: UserRole;

  // 儲存到 DB 前先加密 password
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
