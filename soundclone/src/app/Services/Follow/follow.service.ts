import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface FollowDTO {
  id?: number;
  artistId: number;
  followerId: number;
}
@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private apiUrl = 'https://localhost:7124/api/Follow';

  constructor(private http: HttpClient, private authService: AuthService) { }

  public ToggleUserFollowStatus(artistId: number): Observable<boolean> {
    const userId = this.authService.getCurrentUserUserId();
    if (userId === null) {
      throw new Error('User ID is null. User must be logged in to follow.');
    }
    const followDto: FollowDTO = {
      artistId: artistId,
      followerId: userId
    };
     const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authService.getToken()}`
        });

    return this.http.put<boolean>(`${this.apiUrl}/toggle-follow-status`, followDto, { headers });
  }

  public IsFollowing(artistId: number): Observable<boolean> {
    const userId = this.authService.getCurrentUserUserId();

    if (userId === null) {
      return of(false);
    }
    const followDto: FollowDTO = {
      artistId: artistId,
      followerId: userId
    };



    return this.http.post<boolean>(`${this.apiUrl}/is-following`, followDto);
  }
}
