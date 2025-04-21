import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantDetailsComponent } from './applicant-details.component';

describe('ApplicantDetailsComponent', () => {
  let component: ApplicantDetailsComponent;
  let fixture: ComponentFixture<ApplicantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicantDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
