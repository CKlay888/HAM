import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RechargeDto } from './dto/recharge.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        username: string;
        bio: string;
        avatar: string;
        createdAt: Date;
    }>;
    updateProfile(dto: UpdateProfileDto, req: any): Promise<{
        id: string;
        email: string;
        username: string;
        bio: string;
        avatar: string;
        createdAt: Date;
    }>;
    getBalance(req: any): Promise<{
        userId: string;
        balance: number;
        currency: string;
    }>;
    recharge(dto: RechargeDto, req: any): Promise<{
        userId: string;
        amount: number;
        balance: number;
        currency: string;
        message: string;
    }>;
    getOrders(req: any): Promise<({
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
    getMyAgents(req: any): Promise<import("../agents/entities/agent.entity").Agent[]>;
}
