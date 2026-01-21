import { TestBed } from '@angular/core/testing';

import { SmeComplaintListService } from './sme-complaint-list.service';

describe('SmeComplaintListService', () => {
  let service: SmeComplaintListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmeComplaintListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
