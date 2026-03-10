export enum ToolType {
  SCRIPT = 'script',
  WEBHOOK = 'webhook',
}

export enum ToolStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export enum WebhookMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export class Tool {
  id: string;
  name: string;
  description?: string;
  type: ToolType;
  status: ToolStatus;
  tenantId: string;
  params: object[];
  scriptContent?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  webhookMethod?: WebhookMethod;
  createdAt: Date;

  isActive(): boolean {
    return this.status === ToolStatus.ACTIVE;
  }

  disable(): void {
    this.status = ToolStatus.DISABLED;
  }

  enable(): void {
    this.status = ToolStatus.ACTIVE;
  }
}
