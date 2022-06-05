import { PagedAndSortedRequest } from "../Common/paged-and-sorted-request";

export interface CartLookUpDto extends PagedAndSortedRequest
{
    with_detail?:boolean;
}