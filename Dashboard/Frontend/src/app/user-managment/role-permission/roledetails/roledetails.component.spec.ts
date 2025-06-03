import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoledetailsComponent } from './roledetails.component';

describe('RoledetailsComponent', () => {
  let component: RoledetailsComponent;
  let fixture: ComponentFixture<RoledetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoledetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoledetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
