import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { RunToolUseCase } from '../application/run-tool.usecase';
import { PgExecutionRepository } from '../infrastructure/persistence/pg-execution.repository';
import { RunToolDto } from './dto/run-tool.dto';
import { GetExecutionUseCase } from '../application/get-execution.usecase';
import { ExecutionNotFoundException } from '../domain/execution.errors';

const TEMP_TENANT_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const TEMP_USER_ID = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';

@Controller('executions')
export class ExecutionsController {
  constructor(
    private readonly runToolUseCase: RunToolUseCase,
    private readonly getExecutionUseCase: GetExecutionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async run(@Body() dto: RunToolDto) {
    return this.runToolUseCase.execute({
      toolId: dto.toolId,
      tenantId: TEMP_TENANT_ID,
      userId: TEMP_USER_ID,
      params: dto.params ?? {},
    });
  }

  @Get()
  async findAll() {
    return this.getExecutionUseCase.findByTenant(TEMP_TENANT_ID);
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
