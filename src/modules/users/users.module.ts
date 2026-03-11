import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { PgUserRepository } from './infrastructure/persistence/pg-user.repository';
import { USER_REPOSITORY } from './domain/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { TenantModule } from '../tenants/tenants.module';
import { UserController } from './interface/users.controller';
import { AuthController } from './interface/auth.controller';
import { RegisterTenantUseCase } from '../tenants/application/register-tenant.usecase';
import { LoginUseCase } from './application/login.usecase';
import { InviteUserUseCase } from './application/invite-user.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'tool-smith-jw-secret',
      signOptions: { expiresIn: '7d' },
    }),
    TenantModule,
  ],

  providers: [
    PgUserRepository,
    RegisterTenantUseCase,
    LoginUseCase,
    InviteUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: PgUserRepository,
    },
  ],

  controllers: [UserController, AuthController],

  exports: [
    {
      provide: USER_REPOSITORY,
      useClass: PgUserRepository,
    },
  ],
})
export class UsersModule {}
