import { PagedAndSortedRequest } from "../Common/paged-and-sorted-request";

export interface ProductDetailLookUpDto extends PagedAndSortedRequest{
    consumeable_only?:boolean;
    with_detail?:boolean;
    product_id?:number;
}
