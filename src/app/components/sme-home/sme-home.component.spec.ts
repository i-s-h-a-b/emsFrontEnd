import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeHomeComponent } from './sme-home.component';

describe('SmeHomeComponent', () => {
  let component: SmeHomeComponent;
  let fixture: ComponentFixture<SmeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmeHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
