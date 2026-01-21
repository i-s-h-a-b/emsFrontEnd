import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSmeComponent } from './add-sme.component';

describe('AddSmeComponent', () => {
  let component: AddSmeComponent;
  let fixture: ComponentFixture<AddSmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSmeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
