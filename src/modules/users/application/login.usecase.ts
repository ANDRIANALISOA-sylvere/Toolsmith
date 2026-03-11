import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../domain/user.repository';
import { JwtService } from '@nestjs/jwt';
import { InvalidCredentialsException } from '../domain/user.errors';
import * as bcrypt from 'bcrypt';

export interface LoginInput {
  email: string;
  password: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginInput) {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) throw new InvalidCredentialsException();

    const validPassword = await bcrypt.compare(input.password, user.password);
    if (!validPassword) throw new InvalidCredentialsException();

    const token = this.jwtService.sign({
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }
}
