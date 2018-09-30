import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPreviewComponent } from './member-preview.component';

describe('MemberPreviewComponent', () => {
  let component: MemberPreviewComponent;
  let fixture: ComponentFixture<MemberPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
