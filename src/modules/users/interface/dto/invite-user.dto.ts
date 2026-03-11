import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../../domain/user.entity';

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsEnum(UserRole)
  role: UserRole;
}
