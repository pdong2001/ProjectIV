import { CategoryDto } from "../Category/category-dto";
import { BlobDto } from "../Blob/blob-dto";
import { FullAuditedEntity } from "../Common/full-audited-entity";
import { ImageAssign } from "../Common/image";
import { ProductDetailDto } from "../ProductDetail/product-detail-dto";
import { ProductOptionDto } from "./product-option-dto";

export interface ProductDto extends FullAuditedEntity {
    category_id ?:number;
    code?:string;
    default_image?:number;
    image?:BlobDto;
    name:string;
    option_count:number;
    provider_id?:number;
    quantity:number;
    visible:boolean;
    images: ImageAssign[];
    description?:string;
    short_description?:string;
    category?:CategoryDto;
    provider?:any;
    details?: ProductDetailDto[];
    options: ProductOptionDto[];
    min_price:number;
    max_price:number;
}