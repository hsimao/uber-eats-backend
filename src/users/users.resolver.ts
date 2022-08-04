import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import {
  LoginInput,
  LoginOutput,
  CreateAccountOutput,
  CreateAccountInput,
  EditProfileOutput,
  UserProfileInput,
  UserProfileOutput
} from './dtos';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth-user.decorator';
@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // 取得當前登入 user 資料
  @Query(returns => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  // 取得指定用戶資料 by Id
  @UseGuards(AuthGuard)
  @Query(returns => UserProfileOutput)
  async userProfile(
    @Args() userProfileInput: UserProfileInput
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.usersService.findById(userProfileInput.userId);
      return { ok: Boolean(user), user };
    } catch (err) {
      return { ok: false, error: 'User Not Found' };
    }
  }

  // 編輯用戶資料
  @UseGuards(AuthGuard)
  @Mutation(returns => EditProfileOutput)

  // 創建帳號
  @Mutation(returns => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput
  ): Promise<CreateAccountOutput> {
    try {
      return this.usersService.createAccount(createAccountInput);
    } catch (error) {
      return { ok: false, error };
    }
  }

  // 登入
  @Mutation(returns => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return this.usersService.login(loginInput);
    } catch (error) {
      return { ok: false, error };
    }
  }
}
