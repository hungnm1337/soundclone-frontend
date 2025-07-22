import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { UploadService } from '../UploadFile/upload.service';
import { switchMap } from 'rxjs/operators';
export interface PlaylistMenu {
  playlistId: number;
  title: string;
  picturePlaylistUrl: string;
  trackQuantity: number;
  isPublish: boolean;
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

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

private apiUrl = 'https://localhost:7124/api/Playlist';

  constructor(private http: HttpClient, private authService: AuthService, private uploadService: UploadService) { }

  GetPlaylistMenu(): Observable<PlaylistMenu[]> {
    const userId = this.authService.getCurrentUserUserId();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.get<PlaylistMenu[]>(`${this.apiUrl}/playlist-menu?userId=${userId}`, { headers });
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
