import { DomainException } from 'src/shared/exceptions/domain.exception';

export class ToolNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Tool with id "${id}" not found`);
    this.name = 'ToolNotFoundException';
  }
}

export class ToolDisabledException extends DomainException {
  constructor(id: string) {
    super(`Tool "${id}" is disabled and cannot be executed`);
    this.name = 'ToolDisabledException';
  }
}

export class ToolAlreadyExistsException extends DomainException {
  constructor(name: string) {
    super(`Tool with name "${name}" already exists`);
    this.name = 'ToolAlreadyExistsException';
  }
}
