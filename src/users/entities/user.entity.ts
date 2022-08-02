import {
  Field,
  ObjectType,
  InputType,
  registerEnumType
} from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';

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
}
