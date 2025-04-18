import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFaqComponent } from './add-faq.component';

describe('AddFaqComponent', () => {
  let component: AddFaqComponent;
  let fixture: ComponentFixture<AddFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFaqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
