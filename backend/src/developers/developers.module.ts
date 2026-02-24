import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevelopersController } from './controllers/developers.controller';
import { DevelopersService } from './services/developers.service';
import { Developer, DeveloperEarning, Withdrawal } from '../entities/developer.entity';
import { Agent } from '../entities/agent.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Developer, DeveloperEarning, Withdrawal, Agent, User
    ])
  ],
  controllers: [DevelopersController],
  providers: [DevelopersService],
  exports: [DevelopersService],
})
export class DevelopersModule {}
