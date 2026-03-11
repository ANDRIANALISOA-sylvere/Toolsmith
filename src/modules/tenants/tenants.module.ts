import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantOrmEntity } from './infrastructure/persistence/tenant.orm-entity';
import { PgTenantRepository } from './infrastructure/persistence/pg-tenant.repository';
import { TENANT_REPOSITORY } from './domain/tenant.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TenantOrmEntity])],
  providers: [
    PgTenantRepository,
    {
      provide: TENANT_REPOSITORY,
      useClass: PgTenantRepository,
    },
  ],

  exports: [
    {
      provide: TENANT_REPOSITORY,
      useClass: PgTenantRepository,
    },
  ],
})
export class TenantModule {}
