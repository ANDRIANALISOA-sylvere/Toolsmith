import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ToolType } from '../../domain/tool.entity';
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

  @IsEnum(ToolType)
  type: ToolType;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ToolParamDto)
  params?: ToolParamDto[];

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
