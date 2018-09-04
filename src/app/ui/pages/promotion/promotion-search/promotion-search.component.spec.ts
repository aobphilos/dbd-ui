import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionSearchComponent } from './promotion-search.component';

describe('PromotionSearchComponent', () => {
  let component: PromotionSearchComponent;
  let fixture: ComponentFixture<PromotionSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
