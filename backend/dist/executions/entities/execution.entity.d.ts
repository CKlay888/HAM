export declare enum ExecutionStatus {
    PENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class Execution {
    id: string;
    userId: string;
    agentId: string;
    input: Record<string, any>;
    output?: Record<string, any>;
    status: ExecutionStatus;
    errorMessage?: string;
    startedAt: Date;
    completedAt?: Date;
    createdAt: Date;
}
