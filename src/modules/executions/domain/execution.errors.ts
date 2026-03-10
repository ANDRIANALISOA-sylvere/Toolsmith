import { DomainException } from 'src/shared/exceptions/domain.exception';

export class ExecutionNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Execution "${id}" not found`);
    this.name = 'ExecutionNotFoundException';
  }
}
