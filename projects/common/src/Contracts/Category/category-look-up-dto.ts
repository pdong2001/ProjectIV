import { PagedAndSortedRequest } from "../Common/paged-and-sorted-request";

export interface CategoryLookUpDto extends PagedAndSortedRequest {
    visible_only?:boolean;
}
