import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RunToolUseCase } from '../application/run-tool.usecase';
import { RunToolDto } from './dto/run-tool.dto';
import { GetExecutionUseCase } from '../application/get-execution.usecase';
import { ExecutionNotFoundException } from '../domain/execution.errors';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import {
  CurrentUser,
  type CurrentUserData,
} from 'src/shared/decorators/current-user.decorator';
import { UserRole } from 'src/modules/users/domain/user.entity';

@Controller('executions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExecutionsController {
  constructor(
    private readonly runToolUseCase: RunToolUseCase,
    private readonly getExecutionUseCase: GetExecutionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.DEVELOPER, UserRole.OPERATOR)
  async run(@Body() dto: RunToolDto, @CurrentUser() user: CurrentUserData) {
    return this.runToolUseCase.execute({
      toolId: dto.toolId,
      tenantId: user.tenantId,
      userId: user.userId,
      params: dto.params ?? {},
    });
  }

  @Get()
  async findAll(@CurrentUser() user: CurrentUserData) {
    return this.getExecutionUseCase.findByTenant(user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return this.getExecutionUseCase.findById(id);
    } catch (error) {
      if (error instanceof ExecutionNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
