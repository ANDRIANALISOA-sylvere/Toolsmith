import { Inject, Injectable } from '@nestjs/common';
import { Tool, ToolType } from '../domain/tool.entity';
import {
  TOOL_REPOSITORY,
  type ToolRepository,
} from '../domain/tool.repositoty';
import { ToolAlreadyExistsException } from '../domain/tools.error';

export interface RegisterToolInput {
  name: string;
  description?: string;
  type: ToolType;
  tenantId: string;
  params?: {
    name: string;
    type: 'string' | 'number' | 'boolean';
    required: boolean;
    description?: string;
  }[];
  scriptContent?: string;
  webhookUrl?: string;
  webhookSecret?: string;
}

export interface RegisterToolOutput {
  id: string;
  name: string;
  type: ToolType;
  status: string;
}

@Injectable()
export class RegisterToolUseCase {
  constructor(
    @Inject(TOOL_REPOSITORY)
    private readonly toolRepository: ToolRepository,
  ) {}

  async execute(input: RegisterToolInput): Promise<RegisterToolOutput> {
    const existing = await this.toolRepository.findByName(
      input.name,
      input.tenantId,
    );
    if (existing) {
      throw new ToolAlreadyExistsException(input.name);
    }

    const tool = Tool.create({
      name: input.name,
      description: input.description,
      type: input.type,
      tenantId: input.tenantId,
      params: input.params ?? [],
      scriptContent: input.scriptContent,
      webhookUrl: input.webhookUrl,
      webhookSecret: input.webhookSecret,
    });

    await this.toolRepository.save(tool);

    return {
      id: tool.id,
      name: tool.name,
      type: tool.type,
      status: tool.status,
    };
  }
}
