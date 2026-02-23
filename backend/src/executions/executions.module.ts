import { Module } from '@nestjs/common';
import { ExecutionsController } from './executions.controller';
import { ExecutionsService } from './executions.service';
import { AgentsModule } from '../agents/agents.module';
import { PurchasesModule } from '../purchases/purchases.module';

@Module({
  imports: [AgentsModule, PurchasesModule],
  controllers: [ExecutionsController],
  providers: [ExecutionsService],
  exports: [ExecutionsService],
})
export class ExecutionsModule {}
