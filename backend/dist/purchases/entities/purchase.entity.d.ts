export declare enum PurchaseStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare class Purchase {
    id: string;
    userId: string;
    agentId: string;
    amount: number;
    currency: string;
    status: PurchaseStatus;
    createdAt: Date;
    updatedAt: Date;
}
