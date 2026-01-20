import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSmeComponent } from './register-sme.component';

describe('RegisterSmeComponent', () => {
  let component: RegisterSmeComponent;
  let fixture: ComponentFixture<RegisterSmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterSmeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterSmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
