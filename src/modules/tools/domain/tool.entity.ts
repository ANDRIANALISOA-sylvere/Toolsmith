import { UniqueId } from 'src/shared/domain/value-objects/unique-id.vo';
import { ToolDisabledException } from './tools.error';

export enum ToolType {
  SCRIPT = 'script',
  WEBHOOK = 'webhook',
}

export enum ToolStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export interface ToolParam {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  description?: string;
}

export interface CreateToolProps {
  name: string;
  description?: string;
  type: ToolType;
  tenantId: string;
  params?: ToolParam[];
  scriptContent?: string;
  webhookUrl?: string;
  webhookSecret?: string;
}

export class Tool {
  private readonly _id: UniqueId;
  private _name: string;
  private _description?: string;
  private _type: ToolType;
  private _status?: ToolStatus;
  private _tenantId: string;
  private _params: ToolParam[];
  private _scriptContent?: string;
  private _webhookUrl?: string;
  private _webhookSecret?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: CreateToolProps, id?: string) {
    this._id = new UniqueId(id);
    this._name = props.name;
    this._description = props.description;
    this._type = props.type;
    this._status = ToolStatus.ACTIVE;
    this._tenantId = props.tenantId;
    this._params = props.params ?? [];
    this._scriptContent = props.scriptContent;
    this._webhookUrl = props.webhookUrl;
    this._webhookSecret = props.webhookSecret;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  static create(props: CreateToolProps): Tool {
    if (props.type === ToolType.SCRIPT && !props.scriptContent) {
      throw new Error('Script content is required for script tools');
    }

    if (props.type === ToolType.WEBHOOK && !props.webhookUrl) {
      throw new Error('webhook url is required for webhook tools');
    }

    return new Tool(props);
  }

  static reconstitue(
    props: CreateToolProps & { status: ToolStatus },
    id: string,
  ): Tool {
    const tool = new Tool(props, id);
    tool._status = props.status;
    return tool;
  }

  canBeExecuted(): boolean {
    return this._status === ToolStatus.ACTIVE;
  }

  guardCanBeExecuted(): void {
    if (!this.canBeExecuted()) {
      throw new ToolDisabledException(this._id.toString());
    }
  }

  disabled(): void {
    this._status = ToolStatus.DISABLED;
    this._updatedAt = new Date();
  }

  enable(): void {
    this._status = ToolStatus.ACTIVE;
    this._updatedAt = new Date();
  }

  get id(): string {
    return this._id.toString();
  }

  get name(): string {
    return this._name;
  }
  get description(): string | undefined {
    return this._description;
  }
  get type(): ToolType {
    return this._type;
  }
  get status(): ToolStatus | undefined {
    return this._status;
  }
  get tenantId(): string {
    return this._tenantId;
  }
  get params(): ToolParam[] {
    return this._params;
  }
  get scriptContent(): string | undefined {
    return this._scriptContent;
  }
  get webhookUrl(): string | undefined {
    return this._webhookUrl;
  }
  get webhookSecret(): string | undefined {
    return this._webhookSecret;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
}
