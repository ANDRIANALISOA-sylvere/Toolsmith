import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegisterToolUseCase } from '../application/register-tool.usecase';
import { GetToolsUseCase } from '../application/get-tools.usecase';
import { CreateToolDto } from './dto/create-tool.dto';
import {
  ToolAlreadyExistsException,
  ToolNotFoundException,
} from '../domain/tools.error';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/guards/decorators/roles.decorator';
import {
  CurrentUser,
  type CurrentUserData,
} from 'src/shared/guards/decorators/current-user.decorator';

@Controller('tools')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ToolsController {
  constructor(
    private readonly registerToolUseCase: RegisterToolUseCase,
    private readonly getToolsUseCase: GetToolsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin', 'developer')
  async create(
    @Body() dto: CreateToolDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    try {
      return await this.registerToolUseCase.execute({
        ...dto,
        tenantId: user.tenantId,
      });
    } catch (error) {
      if (error instanceof ToolAlreadyExistsException) {
        throw new ConflictException(error.message);
      }

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get()
  async findAll(@CurrentUser() user: CurrentUserData) {
    return this.getToolsUseCase.getAll(user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
    try {
      return await this.getToolsUseCase.getOne(id, user.tenantId);
    } catch (e) {
      if (e instanceof ToolNotFoundException) {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }
}
