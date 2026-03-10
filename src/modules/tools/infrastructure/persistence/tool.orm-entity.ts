import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  Tool,
  ToolStatus,
  ToolType,
  WebhookMethod,
} from '../../domain/tool.entity';

@Entity('tools')
export class ToolOrmEntity extends Tool {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column()
  declare name: string;

  @Column({ type: 'text', nullable: true })
  declare description?: string;

  @Column({ type: 'enum', enum: ToolType })
  declare type: ToolType;

  @Column({ type: 'enum', enum: ToolStatus, default: ToolStatus.ACTIVE })
  declare status: ToolStatus;

  @Column({
    type: 'enum',
    enum: WebhookMethod,
    default: WebhookMethod.POST,
    nullable: true,
  })
  declare webhookMethod?: WebhookMethod;

  @Column('uuid')
  declare tenantId: string;

  @Column({ type: 'jsonb', default: [] })
  declare params: object[];

  @Column({ type: 'text', nullable: true })
  declare scriptContent?: string;

  @Column({ nullable: true })
  declare webhookUrl?: string;

  @Column({ nullable: true })
  declare webhookSecret?: string;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
