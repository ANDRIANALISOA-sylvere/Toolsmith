import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { InviteUserUseCase } from '../application/invite-user.usecase';
import { InviteUserDto } from './dto/invite-user.dto';
import { UserAlreadyExistsException } from '../domain/user.errors';
import { TenantNotFoundException } from 'src/modules/tenants/domain/tenant.errors';

const TEMP_TENANT_ID = '8dc19d7d-f8d5-4a41-af75-fdf052e847fd';

@Controller('users')
export class UserController {
  constructor(private readonly inviteUserUseCase: InviteUserUseCase) {}

  @Post('invite')
  @HttpCode(HttpStatus.CREATED)
  async invite(@Body() dto: InviteUserDto) {
    try {
      return await this.inviteUserUseCase.execute({
        ...dto,
        tenantId: TEMP_TENANT_ID,
      });
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw new ConflictException(error.message);
      }

      if (error instanceof TenantNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
