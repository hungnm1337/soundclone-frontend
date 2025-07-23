import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PlayerTrack {
  id: number;
  title: string;
  artist: string;
  audioFileUrl: string;
  coverArtUrl?: string;
}

const PLAYER_TRACK_KEY = 'player_current_track';
const PLAYER_IS_PLAYING_KEY = 'player_is_playing';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private currentTrackSubject: BehaviorSubject<PlayerTrack | null>;
  currentTrack$;

  private isPlayingSubject: BehaviorSubject<boolean>;
  isPlaying$;

  constructor() {
    // Lấy trạng thái từ localStorage nếu có
    const savedTrack = localStorage.getItem(PLAYER_TRACK_KEY);
    const savedIsPlaying = localStorage.getItem(PLAYER_IS_PLAYING_KEY);
    this.currentTrackSubject = new BehaviorSubject<PlayerTrack | null>(savedTrack ? JSON.parse(savedTrack) : null);
    this.currentTrack$ = this.currentTrackSubject.asObservable();
    this.isPlayingSubject = new BehaviorSubject<boolean>(savedIsPlaying ? JSON.parse(savedIsPlaying) : false);
    this.isPlaying$ = this.isPlayingSubject.asObservable();
  }

  setTrack(track: PlayerTrack) {
    this.currentTrackSubject.next(track);
    localStorage.setItem(PLAYER_TRACK_KEY, JSON.stringify(track));
    this.isPlayingSubject.next(true);
    localStorage.setItem(PLAYER_IS_PLAYING_KEY, 'true');
  }

  play() {
    this.isPlayingSubject.next(true);
    localStorage.setItem(PLAYER_IS_PLAYING_KEY, 'true');
  }

  pause() {
    this.isPlayingSubject.next(false);
    localStorage.setItem(PLAYER_IS_PLAYING_KEY, 'false');
  }

  stop() {
    this.isPlayingSubject.next(false);
    localStorage.setItem(PLAYER_IS_PLAYING_KEY, 'false');
    this.currentTrackSubject.next(null);
    localStorage.removeItem(PLAYER_TRACK_KEY);
  }
}
