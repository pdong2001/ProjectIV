import { Component, OnInit } from '@angular/core';
import { TitleService } from 'projects/admin/src/app/services/title.service';
import { BlogDto } from 'projects/common/src/Contracts/Blog/blog-dto';
import { BlogService } from 'projects/common/src/lib/services/blog.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent implements OnInit {
  blogs: BlogDto[] | undefined;
  constructor(private blogService: BlogService) {

    }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.blogService.getList({
      page: 1,
      limit: 10
    }).subscribe({
      next: res => {
        this.blogs = res.data;
      }
    });
  }
}
