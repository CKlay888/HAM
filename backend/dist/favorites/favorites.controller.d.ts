import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
export declare class FavoritesController {
    private favoritesService;
    constructor(favoritesService: FavoritesService);
    findAll(req: any): Promise<{
        agent: import("../agents/entities/agent.entity").Agent;
        id: string;
        userId: string;
        agentId: string;
        createdAt: Date;
    }[]>;
    create(dto: CreateFavoriteDto, req: any): Promise<import("./entities/favorite.entity").Favorite>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
