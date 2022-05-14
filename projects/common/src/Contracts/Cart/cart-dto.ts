import { Entity } from "../Common/entity";
import { ProductDetailDto } from "../ProductDetail/product-detail-dto";

export interface CartDto extends Entity {
    product_detail?: ProductDetailDto;
    product_detail_id: number;
    quantity:number;
}