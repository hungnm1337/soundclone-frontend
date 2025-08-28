import { Component } from '@angular/core';
import { ListTrackComponent } from "../../common.component/list-track/list-track.component";
import { PlaylistService, PlaylistDetailDTO } from '../../../Services/Playlist/playlist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ListTrackDTO } from '../../../Services/ListData/list-data.service';
import { ListDataService } from '../../../Services/ListData/list-data.service';
@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [ListTrackComponent],
  templateUrl: './playlist-detail.component.html',
  styleUrl: './playlist-detail.component.scss'
})
export class PlaylistDetailComponent {
  playlistDetail: PlaylistDetailDTO | undefined;
  playlistId: number | null = null;
  trackInPlaylist : ListTrackDTO[] = [];
  constructor(private playlistService: PlaylistService
    , private route: ActivatedRoute
    , private router: Router
    , private listDataService: ListDataService) {
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
      }else{
        this.router.navigate(['/error']);
      }
    });

  }
}
