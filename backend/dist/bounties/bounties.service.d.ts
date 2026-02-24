import { Bounty, BountyApplication } from './entities/bounty.entity';
import { CreateBountyDto } from './dto/create-bounty.dto';
import { ApplyBountyDto } from './dto/apply-bounty.dto';
import { DeliverBountyDto } from './dto/deliver-bounty.dto';
import { QueryBountyDto } from './dto/query-bounty.dto';
export declare class BountiesService {
    private bounties;
    create(dto: CreateBountyDto, creatorId: string): Promise<Bounty>;
    findAll(query: QueryBountyDto): Promise<{
        data: Bounty[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Bounty>;
    apply(id: string, dto: ApplyBountyDto, applicantId: string): Promise<BountyApplication>;
    acceptApplication(bountyId: string, applicationId: string, userId: string): Promise<Bounty>;
    deliver(id: string, dto: DeliverBountyDto, userId: string): Promise<Bounty>;
    complete(id: string, userId: string): Promise<Bounty>;
    cancel(id: string, userId: string): Promise<Bounty>;
    getMyBounties(userId: string, role: 'creator' | 'assignee'): Promise<Bounty[]>;
    private sortBounties;
}
