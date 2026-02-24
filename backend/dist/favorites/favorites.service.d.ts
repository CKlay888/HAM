import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { AgentsService } from '../agents/agents.service';
export declare class FavoritesService {
    private agentsService;
    private favorites;
    constructor(agentsService: AgentsService);
    findAll(userId: string): Promise<{
        agent: import("../agents/entities/agent.entity").Agent;
        id: string;
        userId: string;
        agentId: string;
        createdAt: Date;
    }[]>;
    create(dto: CreateFavoriteDto, userId: string): Promise<Favorite>;
    remove(id: string, userId: string): Promise<void>;
}
