import { PagedAndSortedRequest } from "../Common/paged-and-sorted-request";

export interface BlogLookUpDto extends PagedAndSortedRequest
{
    visible_only?:boolean;
}