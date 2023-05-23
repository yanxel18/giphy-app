import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CImagethumbnailComponent } from './c-imagethumbnail.component';

describe('CImagethumbnailComponent', () => {
  let component: CImagethumbnailComponent;
  let fixture: ComponentFixture<CImagethumbnailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CImagethumbnailComponent]
    });
    fixture = TestBed.createComponent(CImagethumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
