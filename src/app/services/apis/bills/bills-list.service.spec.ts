import { TestBed } from '@angular/core/testing';

import { BillsListService } from './bills-list.service';

describe('BillsListService', () => {
  let service: BillsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
