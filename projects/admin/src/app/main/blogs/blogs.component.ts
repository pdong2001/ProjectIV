import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { SortMode } from 'projects/common/src/Contracts/Common/paged-and-sorted-request';
import { BlogDto } from 'projects/common/src/Contracts/Blog/blog-dto';
import { ConfirmService } from 'projects/common/src/lib/services/confirm.service';
import { FileService } from 'projects/common/src/lib/services/file.service';
import { BlogService } from 'projects/common/src/lib/services/blog.service';
import { ToastService } from 'projects/common/src/lib/services/toast.service';
import { firstValueFrom } from 'rxjs';
import { TitleService } from '../../services/title.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { UpSertBlogDto } from 'projects/common/src/Contracts/Blog/upset-blog-dto';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  @ViewChild(FileUpload) upload!: FileUpload;
  blogs: BlogDto[] = [];
  selectedCategories: BlogDto[] = [];
  totalRecords: number = 0;
  selectAll: boolean = false;
  loading: boolean = true;
  selectedBlog!: BlogDto;
  visibleOptions = [
    { label: 'Tất cả', value: false },
    { label: 'Đang hiện thị', value: true },
  ];

  selectedVisibleOption = this.visibleOptions[0];

  public nameInvalid: boolean = false;
  public selectedId: number | undefined;
  public displayAddDialog: boolean = false;
  public displayEditDialog: boolean = false;
  public displayInforDialog: boolean = false;

  get formVisible(): boolean {
    return this.displayAddDialog || this.displayEditDialog;
  }

  set formVisible(value: boolean) {
    this.displayEditDialog = false;
    this.displayAddDialog = value;
  }

  form: FormGroup;

  constructor(
    private breadCrumpService: TitleService,
    private blogService: BlogService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private fileService: FileService,
    formBuilder: FormBuilder
  ) {
    this.breadCrumpService.setPageTitle('Blogs');
    this.breadCrumpService.setTitle('Admin - Blogs');
    this.form = formBuilder.group({
      title: ['', [Validators.required]],
      short_description: ['', [Validators.required]],
      content: ['', []],
    });
  }

  ngOnInit(): void {}

  loadData(event: LazyLoadEvent) {
    this.loading = true;
    this.blogService
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
      })
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.totalRecords = res.meta?.total ?? 0;
            this.blogs = res.data ?? [];
          }
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  showAddDialog() {
    this.form.reset();
    this.selectedId = undefined;
    this.displayEditDialog = false;
    this.displayAddDialog = true;
  }
  async save() {
    if (this.form.valid) {
      const data: UpSertBlogDto = {
        ...this.form.value,
      };
      if (this.upload.files.length > 0) {
        const file = this.upload.files[0];
        await firstValueFrom(this.fileService.upload(file, data.title)).then(
          (res) => {
            if (res.status == true && res.data) {
              data.image_id = res.data.id;
            }
          }
        );
      }
      if (this.displayAddDialog) {
        this.blogService.create(data).subscribe((res) => {
          if (res.status == true) {
            this.loadData(this.dt.createLazyLoadMetadata());
            this.toastService.addSuccess(`Thêm blog thành công`);
            this.upload.clear();
            this.formVisible = false;
          }
        });
      } else if (this.displayEditDialog) {
        this.blogService.update(this.selectedId, data).subscribe((res) => {
          if (res.status == true) {
            this.loadData(this.dt.createLazyLoadMetadata());
            this.toastService.addSuccess(`Chỉnh sửa blog thành công`);
            this.upload.clear();
            this.formVisible = false;
          }
        });
      }
    } else {
      this.toastService.addError('Vui lòng nhập đầy đủ thông tin.');
    }
  }

  delete(cate: BlogDto) {
    this.confirmService.confirm(
      `Bạn có chắc chắn muốn xóa ${cate.title}`,
      () => {
        this.blogService
          .delete(cate.id)
          .toPromise()
          .then((res) => {
            if (res?.status) {
              this.loadData(this.dt.createLazyLoadMetadata());
              this.toastService.addSuccess(`Đã xóa ${cate.title}.`);
            } else {
              this.toastService.addError(`Xóa ${cate.title} thất bại.`);
            }
          });
      }
    );
  }

  showEditDialog(value: BlogDto) {
    this.form.patchValue(value);
    this.selectedId = value.id;
    this.displayAddDialog = false;
    this.displayEditDialog = true;
  }

  showInfoDialog(blog: BlogDto) {
    this.displayInforDialog = true;
    this.selectedBlog = blog;
  }
}
