import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tournees } from './tournees';

describe('Tournees', () => {
  let component: Tournees;
  let fixture: ComponentFixture<Tournees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tournees],
    }).compileComponents();

    fixture = TestBed.createComponent(Tournees);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
