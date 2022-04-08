import { ImageableType } from "projects/common/src/lib/imageable-type";
import { Entity } from "./entity";

export interface InsertImageAssign
{
    imageable_id : number;
    imageable_type : ImageableType;
    blob_id?:number;
    file?:File;
}