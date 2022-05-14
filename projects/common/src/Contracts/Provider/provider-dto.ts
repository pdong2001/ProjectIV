import { AuditedEntity } from "../Common/audited-entity";

export interface ProviderDto extends AuditedEntity
{
    name:string;
    address?:string;
    phone:string;
    visible:boolean;
    file_path?:string;
}