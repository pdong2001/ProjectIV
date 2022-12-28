import { Component, OnInit } from '@angular/core';
import { TitleService } from 'projects/admin/src/app/services/title.service';
import { SortMode } from 'projects/common/src/Contracts/Common/paged-and-sorted-request';
import { InvoiceDetailService } from 'projects/common/src/lib/services/invoice-detail.service';
import { InvoiceService } from 'projects/common/src/lib/services/invoice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public pendingCount: number = 0;
  public preparingCount: number = 0;
  public shippingCount: number = 0;
  public cancelCount: number = 0;

  public statusOptions = [
    { value: 1, label: 'Đang xử lý' },
    { value: 2, label: 'Đã chấp nhận' },
    { value: 3, label: 'Đang chuẩn bị' },
    { value: 4, label: 'Đang giao' },
    { value: 5, label: 'Hoàn tất' },
    { value: 6, label: 'Từ chối' },
    { value: 7, label: 'Yêu cầu hủy' },
    { value: 8, label: 'Hủy' },
    { value: 9, label: 'Trả hàng' },
  ];

  constructor(
    private titleService: TitleService,
    private invoiceService: InvoiceService,
    private invoiceDetailService: InvoiceDetailService
  ) {
    titleService.setPageTitle('Dashboard');
    titleService.setTitle('Admin - Dashboard');
  }

  multiAxisData: any;
  multiAxisOptions = {
    stacked: false,
    plugins: {
      legend: {
        labels: {
          color: '#495057',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: {
          color: '#495057',
        },
        grid: {
          drawOnChartArea: false,
          color: '#ebedef',
        },
      },
    },
  };

  ngOnInit(): void {
    this.multiAxisData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Áo Polo Nữ Coolmax Phối Bo Siêu Mát',
          fill: false,
          borderColor: '#42A5F5',
          yAxisID: 'y',
          tension: 0.4,
          data: [
            Math.round(Math.random() * 10),
            Math.round(Math.random() * 10),
            Math.round(Math.random() * 10),
            Math.round(Math.random() * 10),
            Math.round(Math.random() * 10),
            Math.round(Math.random() * 10),
            Math.round(Math.random() * 10),
          ],
        },
        {
          label: 'Áo Polo Nữ Airycool Bo Kẻ',
          fill: false,
          borderColor: '#00bb7e',
          yAxisID: 'y1',
          tension: 0.4,
          data: [
            Math.round(Math.random() * 10),
            Math.round(Math.random() * 10),
            Math.round(Math.random() * 10),
            Math.round(Math.random() * 10),
            Math.round(Math.random() * 10),
            Math.round(Math.random() * 10),
            Math.round(Math.random() * 10),
          ],
        },
      ],
    };
    this.invoiceService
      .getList({
        page: 1,
        limit: 0,
        status: 1,
      })
      .subscribe((res) => {
        if (res.status == true) {
          this.pendingCount = res.meta.total ?? 0;
        }
      });
    this.invoiceService
      .getList({
        page: 1,
        limit: 0,
        status: 4,
      })
      .subscribe((res) => {
        if (res.status == true) {
          this.shippingCount = res.meta.total ?? 0;
        }
      });
    this.invoiceService
      .getList({
        page: 1,
        limit: 0,
        status: 7,
      })
      .subscribe((res) => {
        if (res.status == true) {
          this.cancelCount = res.meta.total ?? 0;
        }
      });
    this.invoiceService
      .getList({
        page: 1,
        limit: 0,
        status: 2,
      })
      .subscribe((res) => {
        if (res.status == true) {
          this.preparingCount = res.meta.total ?? 0;
        }
      });
    // this.invoiceDetailService
    //   .getList({
    //     page: 1,
    //     limit: 99999,
    //     sort: SortMode.DESC,
    //     column: 'created_at',
    //     with_detail: true
    //   })
    //   .subscribe((res) => {
    //     if (res.status == true) {
    //       res.data?.forEach((i) => {
    //         const created_at = new Date(i.created_at);
    //         const label = `${created_at.getMonth()}/${created_at.getFullYear()}`;
    //         if (
    //           this.multiAxisData.labels.indexOf(label) < 0
    //         ) {
    //           this.multiAxisData.labels.push(label);
    //         }
    //         const dataset = this.multiAxisData.datasets.find(
    //           (d) => (d.label = i.product_detail?.name)
    //         );
    //         if (dataset != null) {
    //           const lableIndex = this.multiAxisData.labels.indexOf(label);
    //           dataset.data[lableIndex] += i.quantity;
    //         } else {
    //           this.multiAxisData.datasets.push({
    //             label: i.product_detail?.name,
    //             data: this.multiAxisData.labels.map((i) => 0),
    //             fill: false,
    //             borderColor: '#42A5F5',
    //             tension: 0.4,
    //             yAxisID: 'y',
    //           });
    //         }
    //       });
    //     }
    //   });
  }
}
