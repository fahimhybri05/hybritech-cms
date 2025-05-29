import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewDetailsComponent } from './interview-details.component';

describe('InterviewDetailsComponent', () => {
  let component: InterviewDetailsComponent;
  let fixture: ComponentFixture<InterviewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterviewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
