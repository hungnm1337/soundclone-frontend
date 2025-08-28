import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Observable, Subject } from 'rxjs';
import { UploadService } from '../UploadFile/upload.service';
import { switchMap, tap } from 'rxjs/operators';
export interface PlaylistMenu {
  playlistId: number;
  title: string;
  picturePlaylistUrl: string;
  trackQuantity: number;
  isPublish: boolean;
}

export interface AddTrackToPlaylist {
  playlistId: number;
  trackId: number;
}

export interface PlaylistCreateInput {
  title: string;
  picturePlaylistUrl: File;
  isPublish: boolean;
}

 interface PlaylistDTO {
  makeBy: number;
  title: string;
  picturePlaylistUrl: string;
  isPublish: boolean;
}

export interface PlaylistDetailDTO {
  playlistId: number;
  title: string;
  picturePlaylistUrl: string;
  trackQuantity: number;
  isPublish: boolean;
  artistName : string;
  artistId : number;
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

private apiUrl = 'https://localhost:7124/api/Playlist';

  private playlistUpdatedSubject = new Subject<void>();
  public playlistUpdated$ = this.playlistUpdatedSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService, private uploadService: UploadService) { }

  AddTrackToPlaylist(data: AddTrackToPlaylist): Observable<any> {
    const userId = this.authService.getCurrentUserUserId();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.post(`${this.apiUrl}/add-track`, data, { headers }).pipe(
      tap(() => this.playlistUpdatedSubject.next())
    );
  }

  GetPlaylistMenu(): Observable<PlaylistMenu[]> {
    const userId = this.authService.getCurrentUserUserId();
    if (!userId) {
      return new Observable<PlaylistMenu[]>(observer => {
        observer.error('User ID is not available');
        observer.complete();
      });
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.get<PlaylistMenu[]>(`${this.apiUrl}/playlist-menu?userId=${userId}`, { headers });
  }

  GetPlaylistDetail(playlistId: number): Observable<PlaylistDetailDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.get<PlaylistDetailDTO>(`${this.apiUrl}/playlist-detail/${playlistId}`, { headers });
  }

  CreatePlaylist(playlist: PlaylistCreateInput): Observable<PlaylistDTO> {
    const userId = this.authService.getCurrentUserUserId();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.uploadService.uploadFile(playlist.picturePlaylistUrl).pipe(
      switchMap(response => {
        const data: PlaylistDTO = {
          makeBy: userId ?? 0,
          title: playlist.title,
          picturePlaylistUrl: response.url,
          isPublish: playlist.isPublish
        };
        return this.http.post<PlaylistDTO>(`${this.apiUrl}/create-playlist`, data, { headers });
      })
    );
  }
}
