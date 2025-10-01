import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { ListTrackDTO, ListPlaylistDTO, ArtistDTO } from '../../interfaces/listdata.interface';


@Injectable({
  providedIn: 'root'
})
export class ListDataService {

  private apiUrl = 'https://localhost:7124/api/ListData';

  constructor(private http: HttpClient, private authService: AuthService) { }

  GetLikedTracks() {
    const userId = this.authService.getCurrentUserUserId();
    return this.http.get<ListTrackDTO[]>(`${this.apiUrl}/liked-tracks?userId=${userId}`);
  }

  GetTracksBySearch(searchTerm: string) {
    return this.http.get<ListTrackDTO[]>(`${this.apiUrl}/search-tracks?query=${encodeURIComponent(searchTerm)}`);
  }

  GetTracksByPlaylistId(playlistId: number) {
    return this.http.get<ListTrackDTO[]>(`${this.apiUrl}/playlist-tracks?playlistId=${playlistId}`);
  }

  GetTracksByArtistId(artistId: number) {
    return this.http.get<ListTrackDTO[]>(`${this.apiUrl}/artist-tracks?artistId=${artistId}`);
  }

  GetLikedPlaylists() {
    const userId = this.authService.getCurrentUserUserId();
    return this.http.get<ListPlaylistDTO[]>(`${this.apiUrl}/liked-playlists?userId=${userId}`);
  }

  GetPlaylistBySearch(searchTerm: string) {
    return this.http.get<ListPlaylistDTO[]>(`${this.apiUrl}/search-playlists?query=${encodeURIComponent(searchTerm)}`);
  }

  GetPlaylistByArtistId(artistId: number) {
    return this.http.get<ListPlaylistDTO[]>(`${this.apiUrl}/artist-playlists?artistId=${artistId}`);
  }

  GetArtistsBySearch(searchTerm: string) {
    return this.http.get<ArtistDTO[]>(`${this.apiUrl}/search-artist?query=${encodeURIComponent(searchTerm)}`);
  }

  GetFollowers(artistId: number) {
    return this.http.get<ArtistDTO[]>(`${this.apiUrl}/follower?artistId=${artistId}`);
  }

  GetFollowing(userId: number) {
    return this.http.get<ArtistDTO[]>(`${this.apiUrl}/following?userId=${userId}`);
  }
}
