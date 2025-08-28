import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistDTO } from '../../../Services/ListData/list-data.service';

@Component({
  selector: 'app-list-artist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-artist.component.html',
  styleUrl: './list-artist.component.scss'
})
export class ListArtistComponent {
  @Input() artistResults: ArtistDTO[] = [];

  // Method to handle artist click
  onArtistClick(artist: ArtistDTO) {
    // TODO: Navigate to artist profile or handle click
    console.log('Artist clicked:', artist);
  }
}
