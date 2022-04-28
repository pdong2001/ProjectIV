import { ProductOptionDto } from "./product-option-dto";

export interface InsertUpdateProductDto {
    category_id ?:number;
    code?:string;
    default_image?:number;
    name:string;
    provider_id?:number;
    visible:boolean;
    description?:string;
    options?: ProductOptionDto[];
}