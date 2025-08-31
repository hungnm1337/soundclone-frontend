import { Component, OnInit } from '@angular/core';
import { ListTrackComponent } from "../../common.component/list-track/list-track.component";
import { PlaylistService, PlaylistDetailDTO } from '../../../Services/Playlist/playlist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ListTrackDTO } from '../../../Services/ListData/list-data.service';
import { ListDataService } from '../../../Services/ListData/list-data.service';
import { LikePlaylistService } from '../../../Services/LikePlaylist/like-playlist.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [ListTrackComponent, CommonModule],
  templateUrl: './playlist-detail.component.html',
  styleUrl: './playlist-detail.component.scss'
})
export class PlaylistDetailComponent implements OnInit {

  isLiked: boolean = false;
  playlistDetail: PlaylistDetailDTO | undefined;
  playlistId: number | null = null;
  trackInPlaylist : ListTrackDTO[] = [];
  likeCount:number = 0;
  isLikeLoading: boolean = false;

  ngOnInit(): void {
    // Removed the premature like status check - it will be called after playlistId is set
  }

  constructor(private playlistService: PlaylistService
    , private route: ActivatedRoute
    , private router: Router
    , private listDataService: ListDataService
    , private likePlaylistService: LikePlaylistService
  ) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.playlistId = id ? +id : null;
      if (this.playlistId) {
        this.playlistService.GetPlaylistDetail(this.playlistId).subscribe(playlist => {
          this.playlistDetail = playlist;
          this.listDataService.GetTracksByPlaylistId(this.playlistId!).subscribe(tracks => {
            this.trackInPlaylist = tracks;
          });
        });

        // Check like status and count after playlistId is available
        this.checkLikeStatus();
        this.updateLikeCount();
      } else {
        this.router.navigate(['/error']);
      }
    });
  }

  checkLikeStatus() {
    if (this.playlistId) {
      this.likePlaylistService.IsLikePlaylist(this.playlistId).subscribe({
        next: (isLiked) => {
          this.isLiked = isLiked;
        },
        error: (error) => {
          console.error('Error checking like status:', error);
          this.isLiked = false;
        }
      });
    }
  }

  toggleLike() {
    if (this.playlistId && !this.isLikeLoading) {
      this.isLikeLoading = true;

      this.likePlaylistService.ToggleUserLikePlaylistStatus(this.playlistId).subscribe({
        next: (success) => {
          if (success) {
            this.isLiked = !this.isLiked;
            this.updateLikeCount();
          }
          this.isLikeLoading = false;
        },
        error: (error) => {
          console.error('Error toggling like:', error);
          this.isLikeLoading = false;
        }
      });
    }
  }

  updateLikeCount() {
    if (this.playlistId) {
      this.likePlaylistService.GetLikePlaylistCount(this.playlistId).subscribe({
        next: (count) => {
          this.likeCount = count;
        },
        error: (error) => {
          console.error('Error updating like count:', error);
        }
      });
    }
  }

}
