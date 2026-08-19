import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, default: 'Admin Tuấn Anh' })
  name: string;

  @Prop({ default: 'admin@honghanhmachines.com' })
  email: string;

  @Prop({ default: 'SUPER_ADMIN' })
  role: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
