import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
export declare class PurchasesController {
    private purchasesService;
    constructor(purchasesService: PurchasesService);
    findAll(req: any): Promise<import("./entities/purchase.entity").Purchase[]>;
    findOne(id: string, req: any): Promise<import("./entities/purchase.entity").Purchase>;
    create(dto: CreatePurchaseDto, req: any): Promise<import("./entities/purchase.entity").Purchase>;
}
