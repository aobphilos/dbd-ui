import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberWholesaleComponent } from './member-wholesale.component';

describe('MemberWholesaleComponent', () => {
  let component: MemberWholesaleComponent;
  let fixture: ComponentFixture<MemberWholesaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberWholesaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberWholesaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
