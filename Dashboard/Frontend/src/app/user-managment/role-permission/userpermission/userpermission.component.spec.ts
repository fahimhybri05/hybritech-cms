import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserpermissionComponent } from './userpermission.component';

describe('UserpermissionComponent', () => {
  let component: UserpermissionComponent;
  let fixture: ComponentFixture<UserpermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserpermissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserpermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
