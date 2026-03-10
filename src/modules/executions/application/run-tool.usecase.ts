import { Inject, Injectable } from '@nestjs/common';
import {
  EXECUTION_REPOSITORY,
  type ExecutionRepository,
} from '../domain/execution.repository';
import { ToolRunnerService } from '../infrastructure/runner/tool-runner.service';
import {
  TOOL_REPOSITORY,
  type ToolRepository,
} from 'src/modules/tools/domain/tool.repositoty';
import { Execution, ExecutionStatus } from '../domain/execution.entity';
import { ToolNotFoundException } from 'src/modules/tools/domain/tools.error';
import { randomUUID } from 'crypto';

export interface RunToolInput {
  toolId: string;
  tenantId: string;
  userId: string;
  params: Record<string, unknown>;
}

@Injectable()
export class RunToolUseCase {
  constructor(
    @Inject(EXECUTION_REPOSITORY)
    private readonly executionRepository: ExecutionRepository,
    private readonly toolRunner: ToolRunnerService,
    @Inject(TOOL_REPOSITORY)
    private readonly toolRepository: ToolRepository,
  ) {}

  async execute(input: RunToolInput): Promise<Execution> {
    const tool = await this.toolRepository.findById(
      input.toolId,
      input.tenantId,
    );
    if (!tool) {
      throw new ToolNotFoundException(input.toolId);
    }

    if (!tool.isActive) {
      throw new Error(`Tool "${tool.name}" is disabled`);
    }

    const execution = new Execution();

    execution.id = randomUUID();
    execution.toolId = tool.id;
    execution.tenantId = input.tenantId;
    execution.userId = input.userId;
    execution.params = input.params;
    execution.status = ExecutionStatus.PENDING;
    execution.startedAt = new Date();

    await this.executionRepository.save(execution);

    execution.markAsRunning();
    await this.executionRepository.save(execution);

    const result = await this.toolRunner.run(tool, input.params);

    if (result.success) {
      execution.markAsSuccess(result.output);
    } else {
      execution.markAsFailed(result.error ?? 'Unknown error');
    }

    await this.executionRepository.save(execution);

    return execution;
  }
}
