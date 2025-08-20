import { TestBed } from '@angular/core/testing';

import { LikeTrackService } from './like-track.service';

describe('LikeTrackService', () => {
  let service: LikeTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikeTrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
