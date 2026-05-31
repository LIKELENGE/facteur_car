import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tournee } from './tournee';

describe('Tournee', () => {
  let component: Tournee;
  let fixture: ComponentFixture<Tournee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tournee],
    }).compileComponents();

    fixture = TestBed.createComponent(Tournee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
