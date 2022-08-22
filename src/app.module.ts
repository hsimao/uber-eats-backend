import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod
} from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User, Verification } from './users/entities';
import { Category, Restaurant } from './restaurants/entities';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { EmailModule } from './email/email.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_PRIVATE_KEY: Joi.string().required(),
        EMAIL_API_KEY: Joi.string().required(),
        EMAIL_DOMAIN_NAME: Joi.string().required(),
        EMAIL_FROM: Joi.string().required()
      })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: process.env.NODE_ENV !== 'prod',
      entities: [User, Verification, Restaurant, Category]
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'x-jwt';
        return {
          user: req['user'],
          token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY]
        };
      }
    }),
    JwtModule.forRoot({
      privateKey: process.env.JWT_PRIVATE_KEY
    }),
    EmailModule.forRoot({
      apiKey: process.env.EMAIL_API_KEY,
      domain: process.env.EMAIL_DOMAIN_NAME,
      fromEmail: process.env.EMAIL_FROM
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
