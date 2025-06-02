import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolelistComponent } from './rolelist.component';

describe('RolelistComponent', () => {
  let component: RolelistComponent;
  let fixture: ComponentFixture<RolelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolelistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RolelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
