import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterWholesaleComponent } from './register-wholesale.component';

describe('RegisterWholesaleComponent', () => {
  let component: RegisterWholesaleComponent;
  let fixture: ComponentFixture<RegisterWholesaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterWholesaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterWholesaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
