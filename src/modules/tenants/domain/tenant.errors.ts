import { DomainException } from 'src/shared/exceptions/domain.exception';

export class TenantAlreadyExistsException extends DomainException {
  constructor(slug: string) {
    super(`Tenant "${slug}" already exists`);
  }
}

export class TenantNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Tenant "${id}" not found`);
  }
}
