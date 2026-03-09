import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { ToolsModule } from './modules/tools/tools.module';
@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), ToolsModule],
})
export class AppModule {}
