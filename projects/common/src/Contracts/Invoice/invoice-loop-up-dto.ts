import { PagedAndSortedRequest } from "../Common/paged-and-sorted-request";

export interface InvoiceLookUpDto extends PagedAndSortedRequest{
    with_detail?:boolean;
    customer?:number;
}