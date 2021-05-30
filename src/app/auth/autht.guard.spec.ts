import { TestBed } from '@angular/core/testing';

import { AuthtGuard } from './autht.guard';

describe('AuthtGuard', () => {
  let guard: AuthtGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthtGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
