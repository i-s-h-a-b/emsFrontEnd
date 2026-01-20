import { TestBed } from '@angular/core/testing';

import { ConsumerListService } from './consumer-list.service';

describe('ConsumerListService', () => {
  let service: ConsumerListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsumerListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
