import { TestBed } from '@angular/core/testing';

import { ForgotpasswordserviceService } from './forgotpasswordservice.service';

describe('ForgotpasswordserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForgotpasswordserviceService = TestBed.get(ForgotpasswordserviceService);
    expect(service).toBeTruthy();
  });
});
