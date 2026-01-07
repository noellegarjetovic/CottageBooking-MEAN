import { TestBed } from '@angular/core/testing';

import { UnregisteredService } from './unregistered.service';

describe('UnregisteredService', () => {
  let service: UnregisteredService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnregisteredService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
