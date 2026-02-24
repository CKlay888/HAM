import { ExecutionsService } from './executions.service';
import { CreateExecutionDto } from './dto/create-execution.dto';
export declare class ExecutionsController {
    private executionsService;
    constructor(executionsService: ExecutionsService);
    findAll(req: any): Promise<import("./entities/execution.entity").Execution[]>;
    findOne(id: string, req: any): Promise<import("./entities/execution.entity").Execution>;
    create(dto: CreateExecutionDto, req: any): Promise<import("./entities/execution.entity").Execution>;
}
