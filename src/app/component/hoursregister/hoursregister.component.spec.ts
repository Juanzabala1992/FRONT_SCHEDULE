import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursregisterComponent } from './hoursregister.component';

describe('HoursregisterComponent', () => {
  let component: HoursregisterComponent;
  let fixture: ComponentFixture<HoursregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoursregisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoursregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
