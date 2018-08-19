import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWholesaleComponent } from './user-wholesale.component';

describe('UserWholesaleComponent', () => {
  let component: UserWholesaleComponent;
  let fixture: ComponentFixture<UserWholesaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserWholesaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWholesaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
