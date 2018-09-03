import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionPreviewComponent } from './promotion-preview.component';

describe('PromotionPreviewComponent', () => {
  let component: PromotionPreviewComponent;
  let fixture: ComponentFixture<PromotionPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
