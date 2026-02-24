import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
export declare class AgentsController {
    private agentsService;
    constructor(agentsService: AgentsService);
    findAll(category?: string, ownerId?: string, isActive?: string): Promise<import("./entities/agent.entity").Agent[]>;
    findOne(id: string): Promise<import("./entities/agent.entity").Agent>;
    create(dto: CreateAgentDto, req: any): Promise<import("./entities/agent.entity").Agent>;
    update(id: string, dto: UpdateAgentDto, req: any): Promise<import("./entities/agent.entity").Agent>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
