import { BlobDto } from "../Blob/blob-dto";
import { FullAuditedEntity } from "../Common/full-audited-entity";
import { ImageAssign } from "../Common/image";
import { ProductDto } from "../Product/product-dto";
import { ProductDetailOptionValueDto } from "./product-detail-option-value-dto";

export interface ProductDetailDto extends FullAuditedEntity {
    out_price?:number;
    in_price?:number;
    remaining_quantity?:number;
    total_quantity?:number;
    default_image?:BlobDto | number;
    product?:ProductDto;
    visible:boolean;
    images:ImageAssign[];
    unit:string;
    product_id?: number;
    options: ProductDetailOptionValueDto[];
}
