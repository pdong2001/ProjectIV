import { CategoryDto } from "../Category/category-dto";
import { Blob } from "../Common/blob";
import { FullAuditedEntity } from "../Common/full-audited-entity";
import { ImageAssign } from "../Common/image";

export interface ProductDto extends FullAuditedEntity {
    category_id ?:number;
    code?:string;
    default_image?:Blob;
    name:string;
    option_count:number;
    provider_id?:number;
    quantity:number;
    visible:boolean;
    images: ImageAssign[];
    description?:string;
    category?:CategoryDto;
    provider?:any;
}