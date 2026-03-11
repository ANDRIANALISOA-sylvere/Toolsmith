import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { PgUserRepository } from './infrastructure/persistence/pg-user.repository';
import { USER_REPOSITORY } from './domain/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './interface/users.controller';
import { AuthController } from './interface/auth.controller';
import { RegisterTenantUseCase } from '../tenants/application/register-tenant.usecase';
import { LoginUseCase } from './application/login.usecase';
import { InviteUserUseCase } from './application/invite-user.usecase';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './infrastructure/persistence/jwt.strategy';
import { TenantModule } from '../tenants/tenants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'tool-smith-jwt-secret',
      signOptions: { expiresIn: '7d' },
    }),
    PassportModule,
    forwardRef(()=>TenantModule)
  ],

  providers: [
    PgUserRepository,
    RegisterTenantUseCase,
    LoginUseCase,
    InviteUserUseCase,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: PgUserRepository,
    },
  ],

  controllers: [UserController, AuthController],

  exports: [
    JwtModule,
    {
      provide: USER_REPOSITORY,
      useClass: PgUserRepository,
    },
  ],
})
export class UsersModule {}
