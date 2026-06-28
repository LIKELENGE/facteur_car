import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculeComponent } from './vehicule';

describe('Vehicule', () => {
  let component: VehiculeComponent;
  let fixture: ComponentFixture<VehiculeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehiculeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
