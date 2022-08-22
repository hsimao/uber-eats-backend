import { JwtService } from './../jwt/jwt.service';
import { UsersService } from './../users/users.service';
import { AllowedRoles } from './role.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext) {
    // 從 metadata 取得 roles
    const apiRoles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler()
    );

    // api 沒有設置 role 直接通過
    if (!apiRoles) return true;

    // 透過中間間取得 token
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;

    if (token) {
      const decoded = this.jwtService.verify(token);
      const hasId = typeof decoded === 'object' && decoded.hasOwnProperty('id');

      if (hasId) {
        const { user } = await this.usersService.findById(decoded['id']);

        if (user) {
          gqlContext['user'] = user;

          // 當前訪問 API 設定的 roles 若有包含 Any 直接通過
          if (apiRoles.includes('Any')) return true;

          // 用戶的 role 角色有匹配到才通過
          return apiRoles.includes(user.role);
        }
      }
    }
    return false;
  }
}
