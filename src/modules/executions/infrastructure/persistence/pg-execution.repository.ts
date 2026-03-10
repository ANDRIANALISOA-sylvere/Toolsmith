import { InjectRepository } from '@nestjs/typeorm';
import { ExecutionRepository } from '../../domain/execution.repository';
import { ExecutionOrmEntity } from './execution-orm.entity';
import { Repository } from 'typeorm';
import { Execution } from '../../domain/execution.entity';

export class PgExecutionRepository implements ExecutionRepository {
  constructor(
    @InjectRepository(ExecutionOrmEntity)
    private readonly repo: Repository<ExecutionOrmEntity>,
  ) {}

  async findById(id: string): Promise<Execution | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByTenant(tenantId: string): Promise<Execution | null> {
    return this.repo.findOne({
      where: { tenantId },
      order: { startedAt: 'DESC' },
    });
  }

  async save(execution: Execution): Promise<void> {
    await this.repo.save(execution);
  }
}
