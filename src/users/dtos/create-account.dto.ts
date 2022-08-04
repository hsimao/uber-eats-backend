import { User } from '../entities/user.entity';
import { InputType, PickType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'role'
]) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
