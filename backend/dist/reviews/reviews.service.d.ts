import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { AgentsService } from '../agents/agents.service';
import { PurchasesService } from '../purchases/purchases.service';
export declare class ReviewsService {
    private agentsService;
    private purchasesService;
    private reviews;
    constructor(agentsService: AgentsService, purchasesService: PurchasesService);
    findByAgent(agentId: string): Promise<Review[]>;
    create(dto: CreateReviewDto, userId: string): Promise<Review>;
    remove(id: string, userId: string): Promise<void>;
}
