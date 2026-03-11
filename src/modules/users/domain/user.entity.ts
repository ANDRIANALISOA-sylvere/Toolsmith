export enum UserRole {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  OPERATOR = 'operator',
}

export class User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  tenantId: string;
  isActive: boolean;
  createdAt: Date;

  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}
