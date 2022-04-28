import { PagedAndSortedRequest } from "../Common/paged-and-sorted-request";

export interface ProductLookUpDto extends PagedAndSortedRequest {
    consumeable_only:boolean;
    with_detail:boolean;
    with_images:boolean;
}