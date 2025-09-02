import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistDetailDTO, ArtistService } from '../../../Services/Artist/artist.service';
import { ListDataService, ListPlaylistDTO, ListTrackDTO } from '../../../Services/ListData/list-data.service';
import { ListTrackComponent } from "../../common.component/list-track/list-track.component";
import { ListPlaylistComponent } from "../../common.component/list-playlist/list-playlist.component";
import { CommonModule } from '@angular/common';
import { PlaylistStateService } from '../../../Services/Playlist/playlist-state.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../Services/auth.service';
import { FollowService } from '../../../Services/Follow/follow.service';
import { FooterComponent } from "../../common.component/footer/footer.component";

@Component({
  selector: 'app-artist-profile',
  standalone: true,
  imports: [ListTrackComponent, ListPlaylistComponent, CommonModule, FooterComponent],
  templateUrl: './artist-profile.component.html',
  styleUrl: './artist-profile.component.scss'
})
export class ArtistProfileComponent implements OnInit, OnDestroy {

  isProfile : boolean = false;
  isFollowing: boolean = false;
  artistId: number= 0;
  artistDetail: ArtistDetailDTO | null = null;
  tracks: ListTrackDTO[] | null = null;
  playlists: ListPlaylistDTO[] | null = null;
  private subscription = new Subscription();

  ngOnInit(): void {
    // Fetch artist details, tracks, and playlists here
    if (this.authService) {
      const userId = this.authService.getCurrentUserUserId();
      if(userId == this.artistId) {
        this.isProfile = true;
      }
    }
    this.artistService.GetArtistDetail(this.artistId).subscribe(detail => {
      this.artistDetail = detail;
      console.log(detail);
    });
    this.listService.GetTracksByArtistId(this.artistId).subscribe(tracks => {
      this.tracks = tracks;
    });
    this.listService.GetPlaylistByArtistId(this.artistId).subscribe(playlists => {
      this.playlists = playlists;
    });

    // Load follow status if not own profile
    if (!this.isProfile) {
      this.loadFollowStatus();
    }

    // Subscribe to playlist updates
    this.subscription.add(
      this.playlistStateService.playlistUpdated$.subscribe(playlistId => {
        if (playlistId) {
          console.log('Playlist updated, refreshing artist playlists...');
          this.loadArtistPlaylists();
        }
      })
    );
  }

  constructor(
    private route: ActivatedRoute,
    private artistService: ArtistService,
    private listService: ListDataService,
    private playlistStateService: PlaylistStateService,
    private authService: AuthService,
    private followService: FollowService

  ) {
    this.route.params.subscribe(params => {
      this.artistId = +params['id'];
    });
  }

  private loadArtistPlaylists() {
    if (this.artistId) {
      this.listService.GetPlaylistByArtistId(this.artistId).subscribe(playlists => {
        this.playlists = playlists;
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadFollowStatus() {
    this.followService.IsFollowing(this.artistId).subscribe(isFollowing => {
      this.isFollowing = isFollowing;
    });
  }

  private refreshArtistDetail() {
    this.artistService.GetArtistDetail(this.artistId).subscribe(detail => {
      this.artistDetail = detail;
    });
  }

  toggleFollowStatus() {
    this.followService.ToggleUserFollowStatus(this.artistId).subscribe(status => {
      this.isFollowing = !this.isFollowing;
      // Refresh artist detail to update follower count
      this.refreshArtistDetail();
      console.log(status ? "Followed" : "Unfollowed");
    });
  }
}
