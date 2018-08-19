import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDealerComponent } from './user-dealer.component';

describe('UserDealerComponent', () => {
  let component: UserDealerComponent;
  let fixture: ComponentFixture<UserDealerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
