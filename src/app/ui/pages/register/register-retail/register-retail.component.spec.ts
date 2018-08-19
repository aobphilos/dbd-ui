import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRetailComponent } from './register-retail.component';

describe('RegisterRetailComponent', () => {
  let component: RegisterRetailComponent;
  let fixture: ComponentFixture<RegisterRetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterRetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterRetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
