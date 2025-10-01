import { Component, OnInit } from '@angular/core';
import { TrackService } from '../../../Services/TrackService/track.service';
import { ArtistService } from '../../../Services/Artist/artist.service';
import { Router } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { Album } from '../../../interfaces/track.interface';
import { Artist } from '../../../interfaces/artist.interface';


@Component({
  selector: 'app-content',
  standalone: true,
  imports: [FooterComponent, CommonModule],
  templateUrl: './content.component.html'
})
export class ContentComponent implements OnInit {
  OpenArtist(artistId: number) {
    this.router.navigate(['home/artist-profile', artistId]);
  }

  constructor(private trackService: TrackService, private artistService: ArtistService, private router: Router) { }
  albums: Album[] = [];
  topAlbums: Album[] = [];
  artists: Artist[] = [];
  ngOnInit() {
    this.trackService.GetAlbum().subscribe({
      next: (data) => {
        this.albums = data;
      },
      error: (error) => {
        console.error('Error fetching albums:', error);
      }
    });
    this.trackService.GetTopAlbum().subscribe({
      next: (data) => {
        this.topAlbums = data;
      },
      error: (error) => {
        console.error('Error fetching top albums:', error);
      }
    });
    this.artistService.GetTop5Artists().subscribe({
      next: (data) => {
        this.artists = data;
        console.log('Top 5 Artists:', this.artists);
      },
      error: (error) => {
        console.error('Error fetching artists:', error);
      }
    });
  }

  OpenTrack(trackId: number) {
    this.router.navigate(['home/track-details', trackId]);
  }
}
