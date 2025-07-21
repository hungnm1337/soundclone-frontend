import { Component, OnInit } from '@angular/core';
import { TrackService, Album } from '../../../Services/TrackService/track.service';

interface Artist {
  id: number;
  name: string;
  imageUrl: string;
}

interface artist {
  id: number;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [],
  templateUrl: './content.component.html'
})
export class ContentComponent implements OnInit {

  constructor(private trackService: TrackService) { }
  albums: Album[] = [];

  ngOnInit() {
    this.trackService.GetAlbum().subscribe({
      next: (data) => {
        this.albums = data;
        console.log('Albums fetched successfully:', this.albums); 
      },
      error: (error) => {
        console.error('Error fetching albums:', error);
      }
    });
  }

  artists: artist[] = [
    {
      id: 1,
      name: "The Midnight Echoes",
      imageUrl: "https://res.cloudinary.com/dcc6dyjeq/image/upload/v1753089434/music_app/images/8f1680ed926f48d938b63f3166fd834b_4a311295-4fc8-4991-aac3-c11bd189b08b.jpg"
    },
    {
      id: 2,
      name: "Neon Pulse",
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "The Woodland Folk",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
    },
    {
        id: 4,
      name: "Neon Pulse",
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
    },
    {
      id: 5,
      name: "City Beats Collective",
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
    }
  ];


}
