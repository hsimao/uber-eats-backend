import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class EditProfileOutput extends CoreOutput {}

// PartialType(PickType(User, ['..', '..']) 搭配使用, 指定只參考 User 指定中的參數, 並可以只接收其一參數
@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password'])
) {}
