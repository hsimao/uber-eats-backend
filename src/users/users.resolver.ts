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
  EditProfileInput,
  UserProfileInput,
  UserProfileOutput,
  VerifyEmailOutput,
  VerifyEmailInput
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
  userProfile(
    @Args() userProfileInput: UserProfileInput
  ): Promise<UserProfileOutput> {
    return this.usersService.findById(userProfileInput.userId);
  }

  // 編輯自己(當前登入)的用戶資料
  @UseGuards(AuthGuard)
  @Mutation(returns => EditProfileOutput)
  editProfile(
    @AuthUser() authUser,
    @Args('input') editProfileInput: EditProfileInput
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }

  // 創建帳號
  @Mutation(returns => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  // 登入
  @Mutation(returns => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Mutation(returns => VerifyEmailOutput)
  verifyEmail(
    @Args('input') { code }: VerifyEmailInput
  ): Promise<VerifyEmailOutput> {
    return this.usersService.verifyEmail(code);
  }
}
