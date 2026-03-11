import { DomainException } from 'src/shared/exceptions/domain.exception';

export class UserAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`User "${email}" already exists`);
  }
}

export class UserNotFoundException extends DomainException {
  constructor(id: string) {
    super(`User "${id}" not found`);
  }
}

export class InvalidCredentialsException extends DomainException {
  constructor() {
    super('Invalid email or password');
  }
}
