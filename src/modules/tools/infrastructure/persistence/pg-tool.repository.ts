import { InjectRepository } from '@nestjs/typeorm';
import { ToolRepository } from '../../domain/tool.repositoty';
import { ToolOrmEntity } from './tool.orm-entity';
import { Repository } from 'typeorm';
import { Tool } from '../../domain/tool.entity';

export class PgToolRepository implements ToolRepository {
  constructor(
    @InjectRepository(ToolOrmEntity)
    private readonly repo: Repository<ToolOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Tool | null> {
    return this.repo.findOne({ where: { id, tenantId } });
  }

  async findByName(name: string, tenantId: string): Promise<Tool | null> {
    return this.repo.findOne({ where: { name, tenantId } });
  }

  async findAllByTenant(tenantId: string): Promise<Tool[]> {
    return this.repo.find({ where: { tenantId } });
  }

  async save(tool: Tool): Promise<void> {
    await this.repo.save(tool);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
