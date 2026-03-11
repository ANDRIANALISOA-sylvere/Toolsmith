import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterTenantDto {
  @IsString()
  tenantName: string;

  @IsString()
  slug: string;

  @IsString()
  adminName: string;

  @IsEmail()
  adminEmail: string;

  @IsString()
  @MinLength(6)
  adminPassword: string;
}
