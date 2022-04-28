import { AuditedEntity } from "./audited-entity";

export interface FullAuditedEntity extends AuditedEntity{
    isDeleted : boolean;
    deletedTime?: Date;
    deletedBy?:number;
}
