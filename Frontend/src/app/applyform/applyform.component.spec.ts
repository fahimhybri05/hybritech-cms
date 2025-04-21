import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyformComponent } from './applyform.component';

describe('ApplyformComponent', () => {
  let component: ApplyformComponent;
  let fixture: ComponentFixture<ApplyformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplyformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
