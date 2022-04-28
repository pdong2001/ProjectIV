import { Entity } from "./entity";

export interface AuditedEntity extends Entity {
    created_by:number;
    updated_by?:number;
    note?:string;
}
