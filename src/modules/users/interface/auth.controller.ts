import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUseCase } from '../application/login.usecase';
import { RegisterTenantUseCase } from 'src/modules/tenants/application/register-tenant.usecase';
import { RegisterTenantDto } from 'src/modules/tenants/interface/dto/register-tenant.dto';
import { TenantAlreadyExistsException } from 'src/modules/tenants/domain/tenant.errors';
import { InvalidCredentialsException } from '../domain/user.errors';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerTenantUseCase: RegisterTenantUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(@Body() dto: LoginUserDto) {
    try {
      return await this.loginUseCase.execute(dto);
    } catch (error) {
      if (error instanceof InvalidCredentialsException) {
        throw new UnauthorizedException(error.message);
      }
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterTenantDto) {
    try {
      return await this.registerTenantUseCase.execute({
        tenantName: dto.tenantName,
        slug: dto.slug,
        adminName: dto.adminName,
        adminEmail: dto.adminEmail,
        adminPassword: dto.adminPassword,
      });
    } catch (error) {
      if (error instanceof TenantAlreadyExistsException) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }
}
