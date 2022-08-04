import { v4 as uuidv4 } from 'uuid';
import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne, BeforeInsert } from 'typeorm';
import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { User } from './user.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field(type => String)
  code: string;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  // 儲存前自動產生隨機驗證碼
  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
