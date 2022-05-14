import { TestBed } from '@angular/core/testing';

import { WebInfoService } from './web-info.service';

describe('WebInfoService', () => {
  let service: WebInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
