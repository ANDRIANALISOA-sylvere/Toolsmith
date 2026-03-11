import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../domain/user.repository';
import { UserOrmEntity } from './user.orm-entity';
import { Repository } from 'typeorm';
import { User } from '../../domain/user.entity';

export class PgUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByTenant(tenantId: string): Promise<User | null> {
    return this.repo.findOne({ where: { tenantId } });
  }

  async save(user: User): Promise<void> {
    await this.repo.save(user);
  }
}
