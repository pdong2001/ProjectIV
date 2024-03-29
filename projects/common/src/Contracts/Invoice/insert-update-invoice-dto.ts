import { InsertUpdateInvoiceDetailDto } from '../InvoiceDetail/insert-update-invoice-detail-dto';

export interface InsertUpdateInvoiceDto {
  customer_id?: number;
  customer_name?: string;
  phone_number?: string;
  address?: string;
  province: string;
  district: string;
  commune: string;
  note?: string;
  paid?: number;
  status: number;
  details?: InsertUpdateInvoiceDetailDto[];
}
