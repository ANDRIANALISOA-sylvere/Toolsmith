import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExecutionOrmEntity } from './infrastructure/persistence/execution-orm.entity';
import { ToolsModule } from '../tools/tools.module';
import { ExecutionsController } from './interface/executions.controller';
import { RunToolUseCase } from './application/run-tool.usecase';
import { ToolRunnerService } from './infrastructure/runner/tool-runner.service';
import { PgExecutionRepository } from './infrastructure/persistence/pg-execution.repository';
import { EXECUTION_REPOSITORY } from './domain/execution.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ExecutionOrmEntity]), ToolsModule],
  controllers: [ExecutionsController],
  providers: [
    RunToolUseCase,
    ToolRunnerService,
    PgExecutionRepository,
    {
      provide: EXECUTION_REPOSITORY,
      useClass: PgExecutionRepository,
    },
  ],
})
export class ExecutionsModule {}
