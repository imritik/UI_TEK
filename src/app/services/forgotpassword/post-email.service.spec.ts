import { TestBed } from '@angular/core/testing';

import { PostEmailService } from './post-email.service';

describe('PostEmailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostEmailService = TestBed.get(PostEmailService);
    expect(service).toBeTruthy();
  });
});
