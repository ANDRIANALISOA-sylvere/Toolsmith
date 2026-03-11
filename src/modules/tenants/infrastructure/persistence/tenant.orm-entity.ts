import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { Tenant } from '../../domain/tenant.entity';

@Entity('tenants')
export class TenantOrmEntity extends Tenant {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column()
  declare name: string;

  @Column({ unique: true })
  declare slug: string;

  @CreateDateColumn()
  declare createdAt: Date;
}
