import { Tenant } from './tenant.entity';

export interface TenantRepository {
  findById(id: string): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
  save(tenant: Tenant): Promise<void>;
}

export const TENANT_REPOSITORY = Symbol('TENANT_REPOSITORY');
