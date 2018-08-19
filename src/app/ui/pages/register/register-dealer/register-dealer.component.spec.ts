import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDealerComponent } from './register-dealer.component';

describe('RegisterDealerComponent', () => {
  let component: RegisterDealerComponent;
  let fixture: ComponentFixture<RegisterDealerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterDealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
