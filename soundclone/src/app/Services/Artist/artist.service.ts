import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ArtistDetailDTO{
  userId: number;
  name: string;
  profilePictureUrl: string;
  followingQuantity: number
  followerQuantity: number;
  bio:string;
  dayOfBirth: Date;
  email: string;
  phoneNumber: string;
}

export interface Artist {
  userId: number;
  name: string;
  profilePictureUrl: string;
}
@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  private apiUrl = 'https://localhost:7124/api/Artist';

  constructor(private http: HttpClient) { }

  GetTop5Artists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.apiUrl}/get-artist`);
  }

  GetArtistDetail(artistId: number): Observable<ArtistDetailDTO> {
    return this.http.get<ArtistDetailDTO>(`${this.apiUrl}/get-artist-detail/${artistId}`);
  }
}
