import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { User, UserRole } from '../../domain/user.entity';

@Entity('users')
export class UserOrmEntity extends User {
  @PrimaryColumn('uuid')
  declare id: string;

  @Column({ unique: true })
  declare email: string;

  @Column()
  declare password: string;

  @Column()
  declare name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.OPERATOR })
  declare role: UserRole;

  @Column('uuid')
  declare tenantId: string;

  @Column({ default: true })
  declare isActive: boolean;

  @CreateDateColumn()
  declare createdAt: Date;
}
