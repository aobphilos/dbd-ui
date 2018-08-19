import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRetailComponent } from './user-retail.component';

describe('UserRetailComponent', () => {
  let component: UserRetailComponent;
  let fixture: ComponentFixture<UserRetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
