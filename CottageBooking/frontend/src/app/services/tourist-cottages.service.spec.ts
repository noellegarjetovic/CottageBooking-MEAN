import { TestBed } from '@angular/core/testing';

import { TouristCottagesService } from './tourist-cottages.service';

describe('TouristCottagesService', () => {
  let service: TouristCottagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TouristCottagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
