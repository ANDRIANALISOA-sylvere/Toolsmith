import { Inject, Injectable } from '@nestjs/common';
import {
  EXECUTION_REPOSITORY,
  type ExecutionRepository,
} from '../domain/execution.repository';
import { Execution } from '../domain/execution.entity';
import { ExecutionNotFoundException } from '../domain/execution.errors';

@Injectable()
export class GetExecutionUseCase {
  constructor(
    @Inject(EXECUTION_REPOSITORY)
    private readonly executionRepository: ExecutionRepository,
  ) {}

  async findByTenant(tenantId: string): Promise<Execution | null> {
    return await this.executionRepository.findByTenant(tenantId);
  }

  async findById(id: string): Promise<Execution | null> {
    const execution = await this.executionRepository.findById(id);
    if (!execution) throw new ExecutionNotFoundException(id);
    return execution;
  }
}
