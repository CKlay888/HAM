import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';
export declare class SearchController {
    private searchService;
    constructor(searchService: SearchService);
    search(query: SearchQueryDto): Promise<{
        data: import("../agents/entities/agent.entity").Agent[];
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
    getHotAgents(limit?: string): Promise<{
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
    getRecommendedAgents(limit?: string): Promise<{
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
}
