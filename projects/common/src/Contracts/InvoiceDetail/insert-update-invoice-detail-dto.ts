export interface InsertUpdateInvoiceDetailDto
{
    product_detail_id:number;
    invoice_id:number;
    price?:number;
    quantity: number;
}