import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopPreviewComponent } from './shop-preview.component';

describe('ShopPreviewComponent', () => {
  let component: ShopPreviewComponent;
  let fixture: ComponentFixture<ShopPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
