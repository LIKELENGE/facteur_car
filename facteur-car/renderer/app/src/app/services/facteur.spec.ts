import { TestBed } from '@angular/core/testing';

import { Facteur } from './facteur';

describe('Facteur', () => {
  let service: Facteur;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Facteur);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
