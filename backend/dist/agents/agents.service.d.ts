import { Agent } from './entities/agent.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
export declare class AgentsService {
    private agents;
    findAll(query?: {
        category?: string;
        ownerId?: string;
        isActive?: boolean;
    }): Promise<Agent[]>;
    findOne(id: string): Promise<Agent>;
    create(dto: CreateAgentDto, ownerId: string): Promise<Agent>;
    update(id: string, dto: UpdateAgentDto, userId: string): Promise<Agent>;
    remove(id: string, userId: string): Promise<void>;
}
