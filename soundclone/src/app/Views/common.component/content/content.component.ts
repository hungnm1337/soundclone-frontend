import { Component } from '@angular/core';

interface Album {
  id: number;
  title: string;
  artist: string;
  year: number;
  view: number;
  imageUrl: string;
}

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
export class ContentComponent {
  albums: Album[] = [
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "The Midnight Echoes",
      year: 2024,
      view: 1111,
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Electric Soul",
      artist: "Neon Pulse",
      year: 2024,
      view: 2222,
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Acoustic Memories",
      artist: "The Woodland Folk",
      year: 2024,
      view: 3333,
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Urban Rhythms",
      artist: "City Beats Collective",
      year: 2024,
      view: 4444,
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
    },
    {
      id: 5,
      title: "Jazz Fusion",
      artist: "The Modern Jazz Quartet",
      year: 2024,
      view: 5555,
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
    },
    {
      id: 6,
      title: "Rock Anthems",
      artist: "Thunder & Lightning",
      year: 2024,
      view: 6666,
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
    },
    {
      id: 7,
      title: "Classical Harmony",
      artist: "Symphony Orchestra",
      year: 2024,
      view: 7777,
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
    },
    {
      id: 8,
      title: "Blues Journey",
      artist: "Delta Blues Band",
      year: 2024,
      view: 8888,
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
    },
    {
      id: 9,
      title: "Indie Vibes",
      artist: "The Alternative Collective",
      year: 2024,
      view: 9999,
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
    },
    {
      id: 10,
      title: "Country Roads",
      artist: "Southern Comfort",
      year: 2024,
      view: 1111,
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
    }
  ];

  artists: artist[] = [
    {
      id: 1,
      name: "The Midnight Echoes",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
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
