import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CImageviewDialogComponent } from './c-imageview-dialog.component';

describe('CImageviewDialogComponent', () => {
  let component: CImageviewDialogComponent;
  let fixture: ComponentFixture<CImageviewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CImageviewDialogComponent]
    });
    fixture = TestBed.createComponent(CImageviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
