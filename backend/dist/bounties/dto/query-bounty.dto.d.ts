import { BountyStatus } from '../entities/bounty.entity';
export declare enum BountySortBy {
    NEWEST = "newest",
    REWARD_HIGH = "reward_high",
    REWARD_LOW = "reward_low",
    DEADLINE = "deadline"
}
export declare class QueryBountyDto {
    q?: string;
    category?: string;
    status?: BountyStatus;
    minReward?: string;
    maxReward?: string;
    sort?: BountySortBy;
    page?: string;
    limit?: string;
}
