import { BlobDto } from "../Blob/blob-dto";
import { Entity } from "../Common/entity";

export interface WebInfoDto extends Entity
{
    name:string;
    title?:string;
    content?:string;
    link?:string;
    icon?:string;
    blob_id?:number;
    image?:BlobDto
}