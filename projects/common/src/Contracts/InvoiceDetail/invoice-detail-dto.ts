import { Entity } from "../Common/entity";
import { InvoiceDto } from "../Invoice/invoice-dto";
import { ProductDetailDto } from "../ProductDetail/product-detail-dto";

export interface InvoiceDetailDto extends Entity
{
    product_detail_id?:number;
    product_detail?:ProductDetailDto;
    total:number;
    invoice_id:number;
    invoice?:InvoiceDto;
    price:number;
    quantity: number;
}