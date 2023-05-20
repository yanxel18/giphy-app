import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CSearchbarComponent } from './c-searchbar.component';

describe('CSearchbarComponent', () => {
  let component: CSearchbarComponent;
  let fixture: ComponentFixture<CSearchbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CSearchbarComponent]
    });
    fixture = TestBed.createComponent(CSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
