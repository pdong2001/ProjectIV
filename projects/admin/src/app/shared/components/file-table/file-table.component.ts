import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { environment } from 'projects/admin/src/environments/environment';
import { BlobDto } from '../../../../../../common/src/Contracts/Blob/blob-dto';
import { SortMode } from '../../../../../../common/src/Contracts/Common/paged-and-sorted-request';
import { FileService } from '../../../../../../common/src/lib/services/file.service';

@Component({
  selector: 'app-file-table',
  templateUrl: './file-table.component.html',
  styleUrls: ['./file-table.component.css'],
})
export class FileTableComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  @Input('productId') productId: number | undefined;
  @Input('productDetailId') productDetailId: number | undefined;
  @Input('selection') selectedFiles: BlobDto[] = [];
  @Input('value') set value(value: BlobDto[]) {
    this.totalRecords = value.length;
    this.items = value;
    this.loadDataFormService = false;
  }
  @Input('option') set option(value: {
    productId?: number;
    productDetailId?: number;
  }) {
    this._option = value;
    if (!this.loading && this.dt) {
      this.loadBlobs(this.dt.createLazyLoadMetadata());
    }
  }
  @Input('multiple') multiple: boolean = true;
  _option: {
    productId?: number;
    productDetailId?: number;
  } = {};

  get option() {
    return this._option;
  }

  @Output('selectionChange') selectedFilesChange: EventEmitter<BlobDto[]> =
    new EventEmitter<BlobDto[]>();

  loadDataFormService: boolean = true;
  totalRecords!: number;
  items: BlobDto[] = [];
  loading: boolean = false;
  constructor(private fileService: FileService) {}
  getFilePath(value: string) {
    if (!value) return '';
    return environment.FILE_GET_BY_NAME + value;
  }

  ngOnInit(): void {}

  loadBlobs(event: LazyLoadEvent) {
    if (this.loadDataFormService) {
      this.loading = true;
      this.fileService
        .getList({
          limit: event.rows,
          page: ((event.first ?? 0) + (event.rows ?? 10)) / (event.rows ?? 10),
          column: event.sortField ?? '',
          sort: event.sortOrder
            ? event.sortOrder == 1
              ? SortMode.ACS
              : SortMode.DESC
            : '',
          search: event.globalFilter ?? '',
          product_id: this.option.productId ?? 0,
          product_detail_id: this.option.productDetailId ?? 0,
        })
        .subscribe({
          next: (res) => {
            if (res.status) {
              this.totalRecords = res.meta?.total ?? 0;
              this.items = res.data ?? [];
            }
          },
          complete: () => {
            this.loading = false;
          },
        });
    }
  }
  change(e:any)
  {
    if (e instanceof Array)
    {
      this.selectedFiles = e;
    }
    else
    {
      this.selectedFiles = [e];
    }
    this.selectedFilesChange.emit(this.selectedFiles);
  }
}
