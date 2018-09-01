import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDealerComponent } from './member-dealer.component';

describe('MemberDealerComponent', () => {
  let component: MemberDealerComponent;
  let fixture: ComponentFixture<MemberDealerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberDealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
