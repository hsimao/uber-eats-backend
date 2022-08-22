import { UserRole } from './../users/entities/user.entity';
import { SetMetadata } from '@nestjs/common';

type AllowedRoles = keyof typeof UserRole;

export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
