import { Inject, Injectable } from '@nestjs/common';
import {
  TENANT_REPOSITORY,
  type TenantRepository,
} from '../domain/tenant.repository';
import {
  USER_REPOSITORY,
  type UserRepository,
} from 'src/modules/users/domain/user.repository';
import { TenantAlreadyExistsException } from '../domain/tenant.errors';
import { Tenant } from '../domain/tenant.entity';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from 'src/modules/users/domain/user.entity';

export interface RegisterTenantInput {
  tenantName: string;
  slug: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

@Injectable()
export class RegisterTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: RegisterTenantInput) {
    const existing = await this.tenantRepository.findBySlug(input.slug);
    if (existing) throw new TenantAlreadyExistsException(input.slug);

    const tenant = new Tenant();
    tenant.id = randomUUID();
    tenant.name = input.tenantName;
    tenant.slug = input.slug;
    tenant.createdAt = new Date();
    await this.tenantRepository.save(tenant);

    const hashedPassword = await bcrypt.hash(input.adminPassword, 10);
    const admin = new User();
    admin.id = randomUUID();
    admin.name = input.adminName;
    admin.email = input.adminEmail;
    admin.password = hashedPassword;
    admin.role = UserRole.ADMIN;
    admin.tenantId = tenant.id;
    admin.isActive = true;
    admin.createdAt = new Date();
    await this.userRepository.save(admin);

    return {
      tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
      admin: { id: admin.id, email: admin.email, role: admin.role },
    };
  }
}
