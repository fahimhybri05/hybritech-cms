import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleaddComponent } from './roleadd.component';

describe('RoleaddComponent', () => {
  let component: RoleaddComponent;
  let fixture: ComponentFixture<RoleaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
