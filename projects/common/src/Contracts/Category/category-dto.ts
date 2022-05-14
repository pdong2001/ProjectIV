import { AuditedEntity } from "../Common/audited-entity";

export interface CategoryDto extends AuditedEntity{
    name: string;
    visible?: boolean;
    product_count : number;
}
