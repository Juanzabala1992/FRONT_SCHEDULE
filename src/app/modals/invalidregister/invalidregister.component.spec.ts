import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidregisterComponent } from './invalidregister.component';

describe('InvalidregisterComponent', () => {
  let component: InvalidregisterComponent;
  let fixture: ComponentFixture<InvalidregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvalidregisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvalidregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
