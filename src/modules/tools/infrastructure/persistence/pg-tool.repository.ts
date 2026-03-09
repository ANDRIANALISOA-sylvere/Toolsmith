import { InjectRepository } from '@nestjs/typeorm';
import { ToolRepository } from '../../domain/tool.repositoty';
import { ToolOrmEntity } from './tool.orm-entity';
import { Repository } from 'typeorm';
import {
  Tool,
  ToolParam,
  ToolStatus,
  ToolType,
} from '../../domain/tool.entity';

export class PgToolRepository implements ToolRepository {
  constructor(
    @InjectRepository(ToolOrmEntity)
    private readonly ormRepo: Repository<ToolOrmEntity>,
  ) {}

  private toOrm(tool: Tool): ToolOrmEntity {
    const orm = new ToolOrmEntity();
    orm.id = tool.id;
    orm.name = tool.name;
    orm.description = tool.description;
    orm.type = tool.type;
    orm.status = tool.status;
    orm.tenantId = tool.tenantId;
    orm.params = tool.params;
    orm.scriptContent = tool.scriptContent;
    orm.webhookUrl = tool.webhookUrl;
    orm.webhookSecret = tool.webhookSecret;
    return orm;
  }

  private toDomain(orm: ToolOrmEntity): Tool {
    return Tool.reconstitute(
      {
        name: orm.name,
        description: orm.description,
        type: orm.type as ToolType,
        status: orm.status as ToolStatus,
        tenantId: orm.tenantId,
        params: orm.params as ToolParam[],
        scriptContent: orm.scriptContent,
        webhookUrl: orm.webhookUrl,
        webhookSecret: orm.webhookSecret,
      },
      orm.id,
    );
  }

  async findById(id: string, tenantId: string): Promise<Tool | null> {
    const orm = await this.ormRepo.findOne({ where: { id, tenantId } });
    if (!orm) return null;
    return this.toDomain(orm);
  }

  async findByName(name: string, tenantId: string): Promise<Tool | null> {
    const orm = await this.ormRepo.findOne({ where: { name, tenantId } });
    if (!orm) return null;
    return this.toDomain(orm);
  }

  async findAllByTenant(tenantId: string): Promise<Tool[]> {
    const orms = await this.ormRepo.find({ where: { tenantId } });
    return orms.map((orm) => this.toDomain(orm));
  }

  async save(tool: Tool): Promise<void> {
    const orm = this.toOrm(tool);
    await this.ormRepo.save(orm);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete(id);
  }
}
