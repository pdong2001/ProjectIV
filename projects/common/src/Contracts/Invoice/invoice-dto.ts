import { AuditedEntity } from '../Common/audited-entity';
import { InvoiceDetailDto } from '../InvoiceDetail/invoice-detail-dto';

export interface InvoiceDto extends AuditedEntity {
  customer_id?: number;
  total: number;
  paid: number;
  customer_name: string;
  address: string;
  province: string;
  district: string;
  commune: string;
  phone_number: string;
  status: number;
  status_name: string;
  details?: InvoiceDetailDto[];
  cancel_pending?: boolean;
}
