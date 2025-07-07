import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html'
})
export class MenuComponent {
  tracks = [
    { name: 'Blinding Lights', artist: 'The Weeknd' },
    { name: 'Dance Monkey', artist: 'Tones and I' },
    { name: 'Levitating', artist: 'Dua Lipa' },
    { name: 'Shape of You', artist: 'Ed Sheeran' },
    { name: 'Bad Guy', artist: 'Billie Eilish' }
  ];

  artists = [
    { name: 'Taylor Swift', info: 'Pop • 50M+ listeners' },
    { name: 'Drake', info: 'Hip-Hop • 45M+ listeners' },
    { name: 'Ed Sheeran', info: 'Pop • 40M+ listeners' },
    { name: 'Billie Eilish', info: 'Pop • 35M+ listeners' },
    { name: 'Ariana Grande', info: 'Pop • 38M+ listeners' }
  ];

  playlists = [
    { name: 'Workout Mix', songs: 15 },
    { name: 'Chill Vibes', songs: 23 },
    { name: 'Party Hits', songs: 31 },
    { name: 'Focus Flow', songs: 18 },
    { name: 'Top 2024', songs: 20 }
  ];

  showAllTracks = false;
  showAllArtists = false;
  showAllPlaylists = false;

  toggleTracks() {
    this.showAllTracks = !this.showAllTracks;
  }

  toggleArtists() {
    this.showAllArtists = !this.showAllArtists;
  }

  togglePlaylists() {
    this.showAllPlaylists = !this.showAllPlaylists;
  }
}
