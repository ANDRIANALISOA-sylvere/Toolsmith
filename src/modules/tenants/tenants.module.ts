import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantOrmEntity } from './infrastructure/persistence/tenant.orm-entity';
import { PgTenantRepository } from './infrastructure/persistence/pg-tenant.repository';
import { TENANT_REPOSITORY } from './domain/tenant.repository';
import { RegisterTenantUseCase } from './application/register-tenant.usecase';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TenantOrmEntity]),
    forwardRef(() => UsersModule),
  ],
  providers: [
    PgTenantRepository,
    RegisterTenantUseCase,
    {
      provide: TENANT_REPOSITORY,
      useClass: PgTenantRepository,
    },
  ],

  exports: [
    RegisterTenantUseCase,
    {
      provide: TENANT_REPOSITORY,
      useClass: PgTenantRepository,
    },
  ],
})
export class TenantModule {}
