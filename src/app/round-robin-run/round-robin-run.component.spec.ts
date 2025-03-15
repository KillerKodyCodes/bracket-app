import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundRobinRunComponent } from './round-robin-run.component';

describe('RoundRobinRunComponent', () => {
  let component: RoundRobinRunComponent;
  let fixture: ComponentFixture<RoundRobinRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundRobinRunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundRobinRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
