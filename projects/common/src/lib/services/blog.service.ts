import { Injectable } from '@angular/core';
import { BlogDto } from '../../Contracts/Blog/blog-dto';
import { BlogLookUpDto } from '../../Contracts/Blog/blog-look-up-dto';
import { UpSertBlogDto } from '../../Contracts/Blog/upset-blog-dto';
import { CRUDService } from './crudservice';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService extends CRUDService<
  BlogDto,
  UpSertBlogDto,
  BlogLookUpDto
> {
  protected override controller: string = 'admin/blogs';
  constructor(httpClient: HttpService) {
    super(httpClient);
  }
}
