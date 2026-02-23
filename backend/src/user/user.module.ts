import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UsersModule } from '../users/users.module';
import { PurchasesModule } from '../purchases/purchases.module';
import { AgentsModule } from '../agents/agents.module';

@Module({
  imports: [UsersModule, PurchasesModule, AgentsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
