import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleeditComponent } from './roleedit.component';

describe('RoleeditComponent', () => {
  let component: RoleeditComponent;
  let fixture: ComponentFixture<RoleeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleeditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
