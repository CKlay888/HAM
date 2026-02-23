import { Injectable, ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  // 临时内存存储，后续替换为数据库
  private users: Map<string, User> = new Map();

  async findByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async create(
    email: string,
    username: string,
    password: string,
  ): Promise<User> {
    // 检查邮箱是否已存在
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = {
      id: randomUUID(),
      email,
      username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
