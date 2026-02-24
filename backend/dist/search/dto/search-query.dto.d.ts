export declare enum SortBy {
    PRICE_ASC = "price_asc",
    PRICE_DESC = "price_desc",
    NEWEST = "newest",
    RATING = "rating",
    SALES = "sales"
}
export declare class SearchQueryDto {
    q?: string;
    category?: string;
    sort?: SortBy;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    limit?: string;
}
