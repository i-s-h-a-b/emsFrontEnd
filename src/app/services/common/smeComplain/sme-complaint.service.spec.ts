import { TestBed } from '@angular/core/testing';

import { SmeComplaintService } from './sme-complaint.service';

describe('SmeComplaintService', () => {
  let service: SmeComplaintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmeComplaintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
