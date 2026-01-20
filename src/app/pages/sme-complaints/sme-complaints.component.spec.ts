import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeComplaintsComponent } from './sme-complaints.component';

describe('SmeComplaintsComponent', () => {
  let component: SmeComplaintsComponent;
  let fixture: ComponentFixture<SmeComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmeComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmeComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
