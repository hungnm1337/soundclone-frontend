import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LikePlaylistService {
  private apiUrl = 'https://localhost:7124/api/LikePlaylist';

  constructor(private http: HttpClient, private authService: AuthService) { }

  public ToggleUserLikePlaylistStatus(playlistId: number): Observable<boolean> {
    const userId = this.authService.getCurrentUserUserId() || 0;
     const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authService.getToken()}`
        });
    const body: LikePlaylistInput = { playlistId, userId };
    return this.http.put<boolean>(`${this.apiUrl}/toggleStatus`, body, { headers });
  }

  public IsLikePlaylist(playlistId: number): Observable<boolean> {
    const userId = this.authService.getCurrentUserUserId() || 0;
    const body: LikePlaylistInput = { playlistId, userId };
    return this.http.post<boolean>(`${this.apiUrl}/isLiked`, body);
  }

  public GetLikePlaylistCount(playlistId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/like-playlist-count/${playlistId}`);
  }
}


export interface LikePlaylistInput {
  playlistId: number;
  userId: number;
}
