import { Component, OnInit } from '@angular/core';
import { ListTrackComponent } from "../list-track/list-track.component";
import { ListDataService, ListPlaylistDTO, ListTrackDTO } from '../../../Services/ListData/list-data.service';
import { ListPlaylistComponent } from "../list-playlist/list-playlist.component";
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-liked',
  standalone: true,
  imports: [ListTrackComponent, ListPlaylistComponent],
  templateUrl: './liked.component.html',
  styleUrl: './liked.component.scss'
})
export class LikedComponent implements OnInit {
  likedTracks: ListTrackDTO[] = [];
  likePlaylist: ListPlaylistDTO[] = [];
  constructor(private listDataService: ListDataService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/login']);
    }
    this.listDataService.GetLikedTracks().subscribe({
      next: (tracks) => {
        this.likedTracks = tracks;
      },
      error: (err) => {
        console.error('Failed to load liked tracks', err);
        this.likedTracks = [];
      }
    });
    this.listDataService.GetLikedPlaylists().subscribe({
      next: (playlists) => {
        this.likePlaylist = playlists;
      },
      error: (err) => {
        console.error('Failed to load liked playlists', err);
        this.likePlaylist = [];
      }
    });
  }
}
