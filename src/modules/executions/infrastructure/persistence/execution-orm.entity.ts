import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { Execution, ExecutionStatus } from '../../domain/execution.entity';

@Entity('executions')
export class ExecutionOrmEntity extends Execution {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column('uuid')
  declare toolId: string;

  @Column('uuid')
  declare tenantId: string;

  @Column()
  declare userId: string;

  @Column({ type: 'jsonb', default: {} })
  declare params: Record<string, unknown>;

  @Column({
    type: 'enum',
    enum: ExecutionStatus,
    default: ExecutionStatus.PENDING,
  })
  declare status: ExecutionStatus;

  @Column({ type: 'text', nullable: true })
  declare output?: string;

  @Column({ type: 'text', nullable: true })
  declare error?: string;

  @CreateDateColumn()
  declare startedAt: Date;

  @Column({ nullable: true })
  declare finishedAt?: Date;
}
