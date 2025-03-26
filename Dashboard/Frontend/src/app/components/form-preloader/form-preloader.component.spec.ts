import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPreloaderComponent } from './form-preloader.component';

describe('FormPreloaderComponent', () => {
  let component: FormPreloaderComponent;
  let fixture: ComponentFixture<FormPreloaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPreloaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPreloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
