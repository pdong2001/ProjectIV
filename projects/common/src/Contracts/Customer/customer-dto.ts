import { BlobDto } from "../Blob/blob-dto";
import { AuditedEntity } from "../Common/audited-entity";

export interface CustomerDto extends AuditedEntity
{
    name :string;
    phone_number :string;
    province?: string;
    district?: string;
    commune?: string;
    address?: string;
    debt:number;
    birth?:Date;
    bank_number?:string;
    bank_name?:string;
    user_id : number;
    image?:BlobDto
}