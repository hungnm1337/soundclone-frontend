import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistDTO } from '../../../interfaces/listdata.interface';

@Component({
  selector: 'app-list-artist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-artist.component.html',
  styleUrl: './list-artist.component.scss'
})
export class ListArtistComponent {
  @Input() artistResults: ArtistDTO[] = [];

  showAllArtists: boolean = false;
  readonly defaultLimit: number = 5;

  get displayedArtists(): ArtistDTO[] {
    if (this.showAllArtists || this.artistResults.length <= this.defaultLimit) {
      return this.artistResults;
    }
    return this.artistResults.slice(0, this.defaultLimit);
  }

  get hasMoreArtists(): boolean {
    return this.artistResults.length > this.defaultLimit;
  }

  get remainingCount(): number {
    return this.artistResults.length - this.defaultLimit;
  }

  toggleShowAll() {
    this.showAllArtists = !this.showAllArtists;
  }

  // Method to handle artist click
  onArtistClick(artist: ArtistDTO) {
    // TODO: Navigate to artist profile or handle click
    console.log('Artist clicked:', artist);
  }
}
