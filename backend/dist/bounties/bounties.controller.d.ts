import { BountiesService } from './bounties.service';
import { CreateBountyDto } from './dto/create-bounty.dto';
import { ApplyBountyDto } from './dto/apply-bounty.dto';
import { DeliverBountyDto } from './dto/deliver-bounty.dto';
import { QueryBountyDto } from './dto/query-bounty.dto';
export declare class BountiesController {
    private bountiesService;
    constructor(bountiesService: BountiesService);
    create(dto: CreateBountyDto, req: any): Promise<import("./entities/bounty.entity").Bounty>;
    findAll(query: QueryBountyDto): Promise<{
        data: import("./entities/bounty.entity").Bounty[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMyCreated(req: any): Promise<import("./entities/bounty.entity").Bounty[]>;
    getMyAssigned(req: any): Promise<import("./entities/bounty.entity").Bounty[]>;
    findOne(id: string): Promise<import("./entities/bounty.entity").Bounty>;
    apply(id: string, dto: ApplyBountyDto, req: any): Promise<import("./entities/bounty.entity").BountyApplication>;
    acceptApplication(id: string, applicationId: string, req: any): Promise<import("./entities/bounty.entity").Bounty>;
    deliver(id: string, dto: DeliverBountyDto, req: any): Promise<import("./entities/bounty.entity").Bounty>;
    complete(id: string, req: any): Promise<import("./entities/bounty.entity").Bounty>;
    cancel(id: string, req: any): Promise<import("./entities/bounty.entity").Bounty>;
}
