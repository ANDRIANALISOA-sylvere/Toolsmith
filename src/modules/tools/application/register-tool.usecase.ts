import { Inject, Injectable } from '@nestjs/common';
import { Tool, ToolStatus, ToolType } from '../domain/tool.entity';
import {
  TOOL_REPOSITORY,
  type ToolRepository,
} from '../domain/tool.repositoty';
import { ToolAlreadyExistsException } from '../domain/tools.error';
import { randomUUID } from 'crypto';

export interface RegisterToolInput {
  name: string;
  description?: string;
  type: ToolType;
  tenantId: string;
  params?: object[];
  scriptContent?: string;
  webhookUrl?: string;
  webhookSecret?: string;
}

@Injectable()
export class RegisterToolUseCase {
  constructor(
    @Inject(TOOL_REPOSITORY) private readonly toolRepository: ToolRepository,
  ) {}

  async execute(input: RegisterToolInput) {
    const existing = await this.toolRepository.findByName(
      input.name,
      input.tenantId,
    );
    if (existing) {
      throw new ToolAlreadyExistsException(input.name);
    }

    const tool = new Tool();
    tool.id = randomUUID();
    tool.name = input.name;
    tool.description = input.description;
    tool.type = input.type;
    tool.status = ToolStatus.ACTIVE;
    tool.tenantId = input.tenantId;
    tool.params = input.params ?? [];
    tool.scriptContent = input.scriptContent;
    tool.webhookUrl = input.webhookUrl;
    tool.webhookSecret = input.webhookSecret;
    tool.createdAt = new Date();

    await this.toolRepository.save(tool);

    return tool;
  }
}
