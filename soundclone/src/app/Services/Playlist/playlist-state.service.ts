import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistStateService {
  // BehaviorSubject để theo dõi thay đổi playlist
  private playlistDeletedSubject = new BehaviorSubject<number | null>(null);
  private playlistUpdatedSubject = new BehaviorSubject<number | null>(null);

  // Observable để component khác subscribe
  playlistDeleted$ = this.playlistDeletedSubject.asObservable();
  playlistUpdated$ = this.playlistUpdatedSubject.asObservable();

  // Thông báo playlist đã bị xóa
  notifyPlaylistDeleted(playlistId: number) {
    this.playlistDeletedSubject.next(playlistId);
  }

  // Thông báo playlist đã được cập nhật
  notifyPlaylistUpdated(playlistId: number) {
    this.playlistUpdatedSubject.next(playlistId);
  }

  // Reset state
  resetState() {
    this.playlistDeletedSubject.next(null);
    this.playlistUpdatedSubject.next(null);
  }
}
