import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundRobinHomeComponent } from './round-robin-home.component';

describe('RoundRobinHomeComponent', () => {
  let component: RoundRobinHomeComponent;
  let fixture: ComponentFixture<RoundRobinHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundRobinHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundRobinHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
