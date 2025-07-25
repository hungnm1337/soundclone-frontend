import { Component, OnInit } from '@angular/core';
import { TrackService, Album } from '../../../Services/TrackService/track.service';
import { Artist, ArtistService } from '../../../Services/Artist/artist.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-content',
  standalone: true,
  imports: [],
  templateUrl: './content.component.html'
})
export class ContentComponent implements OnInit {

  constructor(private trackService: TrackService, private artistService: ArtistService, private router: Router) { }
  albums: Album[] = [];
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
    // Logic to open the track details, e.g., navigate to a track details page
    console.log('Opening track with ID:', trackId);

    this.router.navigate(['home/track-details', trackId]);
  }
}
