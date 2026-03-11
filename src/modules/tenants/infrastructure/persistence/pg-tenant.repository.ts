import { InjectRepository } from '@nestjs/typeorm';
import { TenantRepository } from '../../domain/tenant.repository';
import { TenantOrmEntity } from './tenant.orm-entity';
import { Repository } from 'typeorm';
import { Tenant } from '../../domain/tenant.entity';

export class PgTenantRepository implements TenantRepository {
  constructor(
    @InjectRepository(TenantOrmEntity)
    private readonly repo: Repository<TenantOrmEntity>,
  ) {}

  async findById(id: string): Promise<Tenant | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    return this.repo.findOne({ where: { slug } });
  }

  async save(tenant: Tenant): Promise<void> {
    await this.repo.save(tenant);
  }
}
