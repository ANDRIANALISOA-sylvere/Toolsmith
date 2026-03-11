import { Inject, Injectable } from '@nestjs/common';
import { User, UserRole } from '../domain/user.entity';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../domain/user.repository';
import { UserAlreadyExistsException } from '../domain/user.errors';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  TENANT_REPOSITORY,
  type TenantRepository,
} from 'src/modules/tenants/domain/tenant.repository';
import { TenantNotFoundException } from 'src/modules/tenants/domain/tenant.errors';

export interface InviteUserInput {
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
}

@Injectable()
export class InviteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,

    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(input: InviteUserInput) {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new UserAlreadyExistsException(input.email);

    const existingTenant = await this.tenantRepository.findById(input.tenantId);
    if (!existingTenant) throw new TenantNotFoundException(input.tenantId);

    const tempPassword = randomUUID().slice(0, 8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = new User();
    user.id = randomUUID();
    user.email = input.email;
    user.name = input.name;
    user.password = hashedPassword;
    user.role = input.role;
    user.tenantId = existingTenant.id;
    user.isActive = true;
    user.createdAt = new Date();
    await this.userRepository.save(user);

    //TODO : envoyer email avec tempPassword (BullMQ)
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      tempPassword,
    };
  }
}
