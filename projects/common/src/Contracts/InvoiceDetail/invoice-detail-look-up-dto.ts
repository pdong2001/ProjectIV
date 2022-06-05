import { PagedAndSortedRequest } from '../Common/paged-and-sorted-request';

export interface InvoiceDetailLookUpDto extends PagedAndSortedRequest {
    invoice_id ?:number;
    with_detail?:boolean;
}
