import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    findByAgent(agentId: string): Promise<import("./entities/review.entity").Review[]>;
    create(dto: CreateReviewDto, req: any): Promise<import("./entities/review.entity").Review>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
