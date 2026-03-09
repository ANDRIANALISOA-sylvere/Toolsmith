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
} from '@nestjs/common';
import { RegisterToolUseCase } from '../application/register-tool.usecase';
import { GetToolsUseCase } from '../application/get-tools.usecase';
import { CreateToolDto } from './dto/create-tool.dto';
import { ToolAlreadyExistsException, ToolNotFoundException } from '../domain/tools.error';

const TEMP_TENANT_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
@Controller('tools')
export class ToolsController {
  constructor(
    private readonly registerToolUseCase: RegisterToolUseCase,
    private readonly getToolsUseCase: GetToolsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateToolDto) {
    try {
      return await this.registerToolUseCase.execute({
        ...dto,
        tenantId: TEMP_TENANT_ID,
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
  async findAll() {
    return this.getToolsUseCase.getAll(TEMP_TENANT_ID);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.getToolsUseCase.getOne(id, TEMP_TENANT_ID);
    } catch (e) {
      if (e instanceof ToolNotFoundException) {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }
}
