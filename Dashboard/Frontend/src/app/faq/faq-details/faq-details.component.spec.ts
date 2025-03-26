import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqDetailsComponent } from './faq-details.component';

describe('FaqDetailsComponent', () => {
  let component: FaqDetailsComponent;
  let fixture: ComponentFixture<FaqDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaqDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
