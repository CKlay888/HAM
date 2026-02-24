import { UsersService } from '../users/users.service';
import { PurchasesService } from '../purchases/purchases.service';
import { AgentsService } from '../agents/agents.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RechargeDto } from './dto/recharge.dto';
export declare class UserService {
    private usersService;
    private purchasesService;
    private agentsService;
    constructor(usersService: UsersService, purchasesService: PurchasesService, agentsService: AgentsService);
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        username: string;
        bio: string;
        avatar: string;
        createdAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        username: string;
        bio: string;
        avatar: string;
        createdAt: Date;
    }>;
    getBalance(userId: string): Promise<{
        userId: string;
        balance: number;
        currency: string;
    }>;
    recharge(userId: string, dto: RechargeDto): Promise<{
        userId: string;
        amount: number;
        balance: number;
        currency: string;
        message: string;
    }>;
    getOrders(userId: string): Promise<({
        agent: {
            id: string;
            name: string;
        };
        id: string;
        userId: string;
        agentId: string;
        amount: number;
        currency: string;
        status: import("../purchases/entities/purchase.entity").PurchaseStatus;
        createdAt: Date;
        updatedAt: Date;
    } | {
        agent: null;
        id: string;
        userId: string;
        agentId: string;
        amount: number;
        currency: string;
        status: import("../purchases/entities/purchase.entity").PurchaseStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getMyAgents(userId: string): Promise<import("../agents/entities/agent.entity").Agent[]>;
}
