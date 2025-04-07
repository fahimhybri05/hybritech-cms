import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerPageComponent } from './career-page.component';

describe('CareerPageComponent', () => {
  let component: CareerPageComponent;
  let fixture: ComponentFixture<CareerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CareerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
