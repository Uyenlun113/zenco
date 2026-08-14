import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly usersService: UsersService) {}

  async login(username: string, password: string) {
    if (!username || !password) {
      throw new UnauthorizedException('Vui lòng nhập tài khoản và mật khẩu!');
    }

    // Query user record directly from MongoDB database
    let user = await this.usersService.findByUsername(username);

    // Fallback auto-seed if database hasn't been seeded yet
    if (!user && (username === 'admin' || username === 'admin@honghanhmachines.com')) {
      await this.usersService.seedAdminUser();
      user = await this.usersService.findByUsername('admin');
    }

    if (!user) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác!');
    }

    // Validate password against database record
    if (user.passwordHash !== password) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác!');
    }

    this.logger.log(`[Auth Success] User "${user.username}" authenticated successfully against MongoDB database.`);

    return {
      success: true,
      token: `honghanh_jwt_token_${user._id}_${Date.now()}`,
      user: {
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    };
  }
}
