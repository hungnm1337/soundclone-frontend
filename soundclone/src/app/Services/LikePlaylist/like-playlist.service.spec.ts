import { TestBed } from '@angular/core/testing';

import { LikePlaylistService } from './like-playlist.service';

describe('LikePlaylistService', () => {
  let service: LikePlaylistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikePlaylistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
