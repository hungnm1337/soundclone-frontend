import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistDetailDTO, ArtistService } from '../../../Services/Artist/artist.service';
import { ListDataService, ListPlaylistDTO, ListTrackDTO } from '../../../Services/ListData/list-data.service';
import { ListTrackComponent } from "../../common.component/list-track/list-track.component";
import { ListPlaylistComponent } from "../../common.component/list-playlist/list-playlist.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artist-profile',
  standalone: true,
  imports: [ListTrackComponent, ListPlaylistComponent,CommonModule],
  templateUrl: './artist-profile.component.html',
  styleUrl: './artist-profile.component.scss'
})
export class ArtistProfileComponent implements OnInit {
  artistId: number= 0;
  artistDetail: ArtistDetailDTO | null = null;
  tracks: ListTrackDTO[] | null = null;
  playlists: ListPlaylistDTO[] | null = null;

  ngOnInit(): void {
    // Fetch artist details, tracks, and playlists here
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
  }

  constructor(private route: ActivatedRoute, private artistService: ArtistService, private listService: ListDataService) {
    this.route.params.subscribe(params => {
      this.artistId = +params['id'];
    });
  }
}
