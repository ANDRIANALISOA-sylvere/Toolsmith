import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { ToolsModule } from './modules/tools/tools.module';
import { ExecutionsModule } from './modules/executions/executions.module';
import { TenantModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ToolsModule,
    ExecutionsModule,
    TenantModule,
    UsersModule
  ],
})
export class AppModule {}
