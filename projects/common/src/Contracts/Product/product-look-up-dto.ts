import { PagedAndSortedRequest } from "../Common/paged-and-sorted-request";

export interface ProductLookUpDto extends PagedAndSortedRequest {
    consumeable_only:boolean;
    with_detail:boolean;
    with_images:boolean;
    has_image_only:boolean;
    visible_only ?:boolean;
    min_price?: number;
    max_price?: number;
    category?: number;
}