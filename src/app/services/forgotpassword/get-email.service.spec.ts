import { TestBed } from '@angular/core/testing';

import { GetEmailService } from './get-email.service';

describe('GetEmailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetEmailService = TestBed.get(GetEmailService);
    expect(service).toBeTruthy();
  });
});
