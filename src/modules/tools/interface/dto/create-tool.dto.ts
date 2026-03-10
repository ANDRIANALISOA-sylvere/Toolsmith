import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ToolType, WebhookMethod } from '../../domain/tool.entity';
import { Type } from 'class-transformer';

class ToolParamDto {
  @IsString()
  name: string;

  @IsEnum(['string', 'number', 'boolean'])
  type: 'string' | 'number' | 'boolean';

  @IsBoolean()
  required: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateToolDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  tenantId: string;

  @IsEnum(ToolType)
  type: ToolType;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ToolParamDto)
  params?: ToolParamDto[];

  @IsEnum(WebhookMethod)
  @IsOptional()
  webhookMethod?: WebhookMethod;

  @IsString()
  @IsOptional()
  scriptContent?: string;

  @IsString()
  @IsOptional()
  webhookUrl?: string;

  @IsString()
  @IsOptional()
  webhookSecret?: string;
}
