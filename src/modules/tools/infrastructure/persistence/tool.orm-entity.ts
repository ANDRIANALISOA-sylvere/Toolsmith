import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ToolStatus, ToolType } from '../../domain/tool.entity';

@Entity('tools')
export class ToolOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: ToolType })
  type: ToolType;

  @Column({ type: 'enum', enum: ToolStatus, default: ToolStatus.ACTIVE })
  status: ToolStatus;

  @Column('uuid')
  tenantId: string;

  @Column({ type: 'jsonb', default: [] })
  params: object[];

  @Column({ type: 'text', nullable: true })
  scriptContent?: string;

  @Column({ nullable: true })
  webhookUrl?: string;

  @Column({ nullable: true })
  webhookSecret?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
