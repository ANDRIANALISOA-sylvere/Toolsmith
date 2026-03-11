import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InviteUserUseCase } from '../application/invite-user.usecase';
import { InviteUserDto } from './dto/invite-user.dto';
import { UserAlreadyExistsException } from '../domain/user.errors';
import { TenantNotFoundException } from 'src/modules/tenants/domain/tenant.errors';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import {
  CurrentUser,
  type CurrentUserData,
} from 'src/shared/decorators/current-user.decorator';
import { UserRole } from '../domain/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly inviteUserUseCase: InviteUserUseCase) {}

  @Post('invite')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async invite(
    @Body() dto: InviteUserDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    try {
      return await this.inviteUserUseCase.execute({
        ...dto,
        tenantId: user.tenantId,
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
