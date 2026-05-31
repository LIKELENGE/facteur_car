import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Facteurs } from './facteurs';

describe('Facteurs', () => {
  let component: Facteurs;
  let fixture: ComponentFixture<Facteurs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Facteurs],
    }).compileComponents();

    fixture = TestBed.createComponent(Facteurs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
