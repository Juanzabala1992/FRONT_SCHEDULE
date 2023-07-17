import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseFollowComponent } from './response-follow.component';

describe('ResponseFollowComponent', () => {
  let component: ResponseFollowComponent;
  let fixture: ComponentFixture<ResponseFollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseFollowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
