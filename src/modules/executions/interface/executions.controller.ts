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

const TEMP_TENANT_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const TEMP_USER_ID = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';

@Controller('executions')
export class ExecutionsController {
  constructor(
    private readonly runToolUseCase: RunToolUseCase,
    private readonly executionRepository: PgExecutionRepository,
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
    return this.executionRepository.findByTenant(TEMP_TENANT_ID);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const execution = await this.executionRepository.findById(id);
    if (!execution) throw new NotFoundException(`Execution ${id} not found`);
    return execution;
  }
}
