import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsmeDetailsComponent } from './msme-details.component';

describe('MsmeDetailsComponent', () => {
  let component: MsmeDetailsComponent;
  let fixture: ComponentFixture<MsmeDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MsmeDetailsComponent]
    });
    fixture = TestBed.createComponent(MsmeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
