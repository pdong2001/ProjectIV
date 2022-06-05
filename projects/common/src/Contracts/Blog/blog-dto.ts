import { BlobDto } from "../Blob/blob-dto";
import { Entity } from "../Common/entity";

export interface BlogDto extends Entity
{
    content?:string;
    title:string;
    image?:BlobDto;
    image_id?:number;
    short_description:string;
}