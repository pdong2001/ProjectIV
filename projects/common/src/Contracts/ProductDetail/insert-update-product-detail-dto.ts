import { UpSertDetailOptionValueDto } from "./up-sert-detail-option-value-dto";

export interface InsertUpdateProductDetailDto {
    visible:boolean;
    option_name:string;
    option_value:string;
    remaining_quantity:number;
    default_image?:number;
    product_id:number;
    out_price:number;
    in_price:number;
    unit:string;
    options: UpSertDetailOptionValueDto[];
}
