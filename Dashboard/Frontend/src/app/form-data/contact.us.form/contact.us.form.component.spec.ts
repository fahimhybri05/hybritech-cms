import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsFormComponent } from './contact.us.form.component';

describe('ContactUsFormComponent', () => {
  let component: ContactUsFormComponent;
  let fixture: ComponentFixture<ContactUsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactUsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactUsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
