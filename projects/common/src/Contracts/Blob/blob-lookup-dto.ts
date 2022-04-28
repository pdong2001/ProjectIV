import { PagedAndSortedRequest } from "../Common/paged-and-sorted-request";

export interface BlobLookUpDto extends PagedAndSortedRequest
{
    product_id?:number;
    product_detail_id?:number;
}