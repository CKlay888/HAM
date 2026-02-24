import { Purchase } from './entities/purchase.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { AgentsService } from '../agents/agents.service';
export declare class PurchasesService {
    private agentsService;
    private purchases;
    constructor(agentsService: AgentsService);
    findAll(userId: string): Promise<Purchase[]>;
    findOne(id: string, userId: string): Promise<Purchase>;
    create(dto: CreatePurchaseDto, userId: string): Promise<Purchase>;
}
