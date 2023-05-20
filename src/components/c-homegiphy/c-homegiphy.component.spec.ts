import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CHomegiphyComponent } from './c-homegiphy.component';

describe('CHomegiphyComponent', () => {
  let component: CHomegiphyComponent;
  let fixture: ComponentFixture<CHomegiphyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CHomegiphyComponent]
    });
    fixture = TestBed.createComponent(CHomegiphyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
