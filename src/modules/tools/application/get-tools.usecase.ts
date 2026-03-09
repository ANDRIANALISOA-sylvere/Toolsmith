import { Inject } from '@nestjs/common';
import {
  TOOL_REPOSITORY,
  type ToolRepository,
} from '../domain/tool.repositoty';
import { ToolNotFoundException } from '../domain/tools.error';

export interface GetToolsOutput {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  params: object[];
}

export class GetToolsUseCase {
  constructor(
    @Inject(TOOL_REPOSITORY)
    private readonly toolRepository: ToolRepository,
  ) {}

  async getAll(tenantId: string): Promise<GetToolsOutput[]> {
    const tools = await this.toolRepository.findAllByTenant(tenantId);

    return tools.map((tool) => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      type: tool.type,
      status: tool.status,
      params: tool.params,
    }));
  }

  async getOne(id: string, tenantId: string): Promise<GetToolsOutput> {
    const tool = await this.toolRepository.findById(id, tenantId);
    if (!tool) {
      throw new ToolNotFoundException(id);
    }
    return {
      id: tool.id,
      name: tool.name,
      description: tool.description,
      type: tool.type,
      status: tool.status,
      params: tool.params,
    };
  }
}
