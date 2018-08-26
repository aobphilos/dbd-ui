import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberRetailComponent } from './member-retail.component';

describe('MemberRetailComponent', () => {
  let component: MemberRetailComponent;
  let fixture: ComponentFixture<MemberRetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberRetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberRetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
