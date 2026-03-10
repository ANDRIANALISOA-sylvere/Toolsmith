export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
}
export class Execution {
  id: string;
  toolId: string;
  tenantId: string;
  userId: string;
  params: Record<string, unknown>;
  status: ExecutionStatus;
  output?: string;
  error?: string;
  startedAt: Date;
  finishedAt?: Date;

  isFinished(): boolean {
    return (
      this.status === ExecutionStatus.SUCCESS ||
      this.status === ExecutionStatus.FAILED
    );
  }

  markAsRunning(): void {
    this.status = ExecutionStatus.RUNNING;
  }

  markAsSuccess(output: string): void {
    this.status = ExecutionStatus.SUCCESS;
    this.output = output;
    this.finishedAt = new Date();
  }

  markAsFailed(error: string): void {
    this.status = ExecutionStatus.FAILED;
    this.error = error;
    this.finishedAt = new Date();
  }
}
