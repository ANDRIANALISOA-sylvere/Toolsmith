import { Tool } from './tool.entity';

export interface ToolRepository {
  findById(id: string, tenantId: string): Promise<Tool | null>;
  findByName(name: string, tenantId: string): Promise<Tool | null>;
  findAllByTenant(tenantId: string): Promise<Tool[]>;
  save(tool: Tool): Promise<void>;
  delete(id: string): Promise<void>;
}

export const TOOL_REPOSITORY = Symbol('TOOL_REPOSITORY');
