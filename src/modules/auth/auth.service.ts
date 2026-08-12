import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(username: string, password: string) {
    if (
      (username === 'admin' || username === 'admin@honghanhmachines.com') &&
      password === 'admin123'
    ) {
      return {
        success: true,
        token: 'honghanh_admin_secret_token_2026',
        user: {
          username: 'admin',
          name: 'Admin Hong Hanh',
          role: 'SUPER_ADMIN',
        },
      };
    }
    throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác!');
  }
}
