import { TestBed } from '@angular/core/testing';

import { ResetPasswordServiceService } from './reset-password-service.service';

describe('ResetPasswordServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResetPasswordServiceService = TestBed.get(ResetPasswordServiceService);
    expect(service).toBeTruthy();
  });
});
