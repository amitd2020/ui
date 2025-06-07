import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsgWatchComponent } from './esg-watch.component';

describe('EsgWatchComponent', () => {
  let component: EsgWatchComponent;
  let fixture: ComponentFixture<EsgWatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsgWatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsgWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
