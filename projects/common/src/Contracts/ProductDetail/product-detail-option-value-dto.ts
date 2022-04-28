import { ProductOptionDto } from "../Product/product-option-dto";

export interface ProductDetailOptionValueDto {
    id?:number;
    value?:string;
    option_id?: number;
    option?: ProductOptionDto;
    name?:string;
}
