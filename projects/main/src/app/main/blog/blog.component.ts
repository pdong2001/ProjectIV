import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'projects/common/src/lib/services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  private _blogId: number | undefined;
  blog:
    | import('d:/VSCode/Project 4/ProjectIV/projects/common/src/Contracts/Blog/blog-dto').BlogDto
    | undefined;
  public get blogId(): number | undefined {
    return this._blogId;
  }
  public set blogId(value: number | undefined) {
    this._blogId = value;
    if (value) {
      this.blogService.get(value).subscribe({
        next: (res) => {
          this.blog = res.data;
        },
      });
    }
  }
  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.blogId = params['id'];
    });
  }
}
