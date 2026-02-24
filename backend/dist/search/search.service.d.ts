import { AgentsService } from '../agents/agents.service';
import { PurchasesService } from '../purchases/purchases.service';
import { ReviewsService } from '../reviews/reviews.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { Agent } from '../agents/entities/agent.entity';
export declare class SearchService {
    private agentsService;
    private purchasesService;
    private reviewsService;
    private categories;
    constructor(agentsService: AgentsService, purchasesService: PurchasesService, reviewsService: ReviewsService);
    search(query: SearchQueryDto): Promise<{
        data: Agent[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getCategories(): Promise<{
        id: string;
        name: string;
        description: string;
    }[]>;
    getHotAgents(limit?: number): Promise<{
        salesCount: number;
        id: string;
        name: string;
        description: string;
        category: string;
        price: number;
        currency: string;
        ownerId: string;
        capabilities: string[];
        apiEndpoint?: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getRecommendedAgents(limit?: number): Promise<{
        recommendScore: string;
        id: string;
        name: string;
        description: string;
        category: string;
        price: number;
        currency: string;
        ownerId: string;
        capabilities: string[];
        apiEndpoint?: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    private sortAgents;
}
