export declare class Agent {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    currency: string;
    ownerId: string;
    capabilities: string[];
    apiEndpoint?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
