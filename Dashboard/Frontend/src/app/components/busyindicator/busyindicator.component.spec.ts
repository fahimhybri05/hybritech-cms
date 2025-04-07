import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusyindicatorComponent } from './busyindicator.component';

describe('BusyindicatorComponent', () => {
  let component: BusyindicatorComponent;
  let fixture: ComponentFixture<BusyindicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusyindicatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusyindicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
