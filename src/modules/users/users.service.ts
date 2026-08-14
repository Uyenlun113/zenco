import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  async seedAdminUser() {
    try {
      const existingUser = await this.userModel.findOne({ username: 'admin' });
      if (!existingUser) {
        // Create default admin user in MongoDB
        const defaultAdmin = await this.userModel.create({
          username: 'admin',
          passwordHash: 'admin123', // In production use bcrypt hash
          name: 'Quản Trị Viên Hồng Hạnh',
          email: 'admin@honghanhmachines.com',
          role: 'SUPER_ADMIN',
          isActive: true,
        });
        this.logger.log(`[Database Seed] Default Admin user created in MongoDB: ${defaultAdmin.username}`);
      } else {
        this.logger.log(`[Database] Admin user already exists in MongoDB: ${existingUser.username}`);
      }
    } catch (err) {
      this.logger.error('[Database Seed Error] Failed to seed admin user:', err);
    }
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username, isActive: true }).exec();
  }
}
