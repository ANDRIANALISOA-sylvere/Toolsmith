import { Execution } from './execution.entity';

export interface ExecutionRepository {
  findById(id: string): Promise<Execution | null>;
  findByTenant(tenantId: string): Promise<Execution | null>;
  save(execution: Execution): Promise<void>;
}

export const EXECUTION_REPOSITORY = Symbol('EXECUTION_REPOSITORY');
