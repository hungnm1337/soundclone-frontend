import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LikeTrackService {
  private apiUrl = 'https://localhost:7124/api/LikeTrack';

  constructor(private http: HttpClient, private authService: AuthService) { }

  public ToggleUserLikeTrackStatus(trackId: number): Observable<boolean> {
     const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authService.getToken()}`
        });
    const userId = this.authService.getCurrentUserUserId() || 0;
    const body: LikeTrackInput = { trackId, userId };
    return this.http.put<boolean>(`${this.apiUrl}/toggleStatus`, body, { headers });
  }

  public IsLikeTrack(trackId: number): Observable<boolean> {
    const userId = this.authService.getCurrentUserUserId() || 0;
    const body: LikeTrackInput = { trackId, userId };
    return this.http.post<boolean>(`${this.apiUrl}/isLiked`, body);
  }

  public GetLikeTrackCount(trackId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/like-track-count/${trackId}`);
  }
}


export interface LikeTrackInput {
  trackId: number;
  userId: number;
}
