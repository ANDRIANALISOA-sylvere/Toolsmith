import { IsObject, IsOptional, IsUUID } from 'class-validator';

export class RunToolDto {
  @IsUUID()
  toolId: string;

  @IsObject()
  @IsOptional()
  params: Record<string, unknown>;
}
