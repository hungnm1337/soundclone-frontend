import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UploadService, UploadResponse } from '../UploadFile/upload.service';
import { AuthService } from '../auth.service';
import { forkJoin, switchMap } from 'rxjs';

interface CreateTrack {
  Title: string;
  Description: string;
  AudioFileUrl: string;
  CoverArtUrl: string;
  DurationInSeconds: number;
  IsPublic: boolean;
  UpdateBy: number;
}

export interface CreateTrackInput {
  Title: string;
  Description: string;
  AudioFile: File;
  CoverArt: File;
  DurationInSeconds: number;
  IsPublic: boolean;
  UpdateBy: number;
}

export interface Album {
  id: number;
  title: string;
  artist: string;
  year: number;
  view: number;
  imageUrl: string;
}

export interface TrackDetail {
  trackId: number;
  title: string;
  description: string;
  audioFileUrl: string;
  coverArtUrl: string;
  waveformUrl: string;
  durationInSeconds: number;
  isPublic: boolean;
  uploadDate: Date;
  updateBy: number;
  playCount: number;
}


@Injectable({
  providedIn: 'root'
})


export class TrackService {
  private apiUrl = 'https://localhost:7124/api/Track';

constructor(private http: HttpClient, private uploadService: UploadService, private authService: AuthService) { }

  public createTrack(input: CreateTrackInput): Observable<CreateTrack> {
  const data: CreateTrack = {
    Title: input.Title,
    Description: input.Description,
    AudioFileUrl: '',
    CoverArtUrl: '',
    DurationInSeconds: input.DurationInSeconds,
    IsPublic: input.IsPublic,
    UpdateBy: this.authService.getCurrentUserUserId() || 0
  };

  const audio$ = this.uploadService.uploadFile(input.AudioFile);
  const cover$ = this.uploadService.uploadFile(input.CoverArt);

  return forkJoin([audio$, cover$]).pipe(
    switchMap(([audioRes, coverRes]) => {
      data.AudioFileUrl = audioRes.url || '';
      data.CoverArtUrl = coverRes.url || '';
      console.log('Gửi dữ liệu lên server:', data);

      const token = this.authService.getToken();
      let headers = new HttpHeaders();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }

      return this.http.post<CreateTrack>(this.apiUrl + '/create', data, { headers });
    })
  );
}

  public GetAlbum(): Observable<Album[]> {
  const token = this.authService.getToken();
  let headers = new HttpHeaders();
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  return this.http.get<Album[]>(this.apiUrl + '/albums', { headers });
}

public GetAlbumByArtist(artistId: number): Observable<Album[]> {
  const token = this.authService.getToken();
  let headers = new HttpHeaders();
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  return this.http.get<Album[]>(`${this.apiUrl}/albums/${artistId}`, { headers });
}

  public GetTrackDetail(id: number): Observable<TrackDetail> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<TrackDetail>(`${this.apiUrl}/getbyid/${id}`, { headers });
  }

}
