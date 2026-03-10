import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToolOrmEntity } from './infrastructure/persistence/tool.orm-entity';
import { ToolsController } from './interface/tools.controller';
import { RegisterToolUseCase } from './application/register-tool.usecase';
import { GetToolsUseCase } from './application/get-tools.usecase';
import { TOOL_REPOSITORY } from './domain/tool.repositoty';
import { PgToolRepository } from './infrastructure/persistence/pg-tool.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ToolOrmEntity])],
  controllers: [ToolsController],
  providers: [
    RegisterToolUseCase,
    GetToolsUseCase,
    {
      provide: TOOL_REPOSITORY,
      useClass: PgToolRepository,
    },
  ],
  exports: [
    {
      provide: TOOL_REPOSITORY,
      useClass: PgToolRepository,
    },
  ],
})
export class ToolsModule {}
