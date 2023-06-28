import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformAdminComponent } from './inform-admin.component';

describe('InformAdminComponent', () => {
  let component: InformAdminComponent;
  let fixture: ComponentFixture<InformAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
