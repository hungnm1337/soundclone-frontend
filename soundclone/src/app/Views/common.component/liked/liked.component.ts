import { Component, OnInit, OnDestroy } from '@angular/core';
import { ListTrackComponent } from "../list-track/list-track.component";
import { ListDataService} from '../../../Services/ListData/list-data.service';
import { ListPlaylistComponent } from "../list-playlist/list-playlist.component";
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { PlaylistStateService } from '../../../Services/Playlist/playlist-state.service';
import { Subscription } from 'rxjs';
import { ListPlaylistDTO, ListTrackDTO } from '../../../interfaces/listdata.interface';
@Component({
  selector: 'app-liked',
  standalone: true,
  imports: [ListTrackComponent, ListPlaylistComponent],
  templateUrl: './liked.component.html',
  styleUrl: './liked.component.scss'
})
export class LikedComponent implements OnInit, OnDestroy {
  likedTracks: ListTrackDTO[] = [];
  likePlaylist: ListPlaylistDTO[] = [];
  private subscription = new Subscription();

  constructor(
    private listDataService: ListDataService,
    private authService: AuthService,
    private router: Router,
    private playlistStateService: PlaylistStateService
  ) {}

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

    // Subscribe to playlist updates
    this.subscription.add(
      this.playlistStateService.playlistUpdated$.subscribe(playlistId => {
        if (playlistId) {
          console.log('Playlist updated, refreshing liked playlists...');
          this.loadLikedPlaylists();
        }
      })
    );
  }

  private loadLikedPlaylists() {
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
