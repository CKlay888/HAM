import { Execution } from './entities/execution.entity';
import { CreateExecutionDto } from './dto/create-execution.dto';
import { AgentsService } from '../agents/agents.service';
import { PurchasesService } from '../purchases/purchases.service';
export declare class ExecutionsService {
    private agentsService;
    private purchasesService;
    private executions;
    constructor(agentsService: AgentsService, purchasesService: PurchasesService);
    findAll(userId: string): Promise<Execution[]>;
    findOne(id: string, userId: string): Promise<Execution>;
    create(dto: CreateExecutionDto, userId: string): Promise<Execution>;
}
