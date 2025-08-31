import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTrackDTO } from '../../../Services/ListData/list-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-track',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-track.component.html',
  styleUrl: './list-track.component.scss'
})
export class ListTrackComponent {
  @Input({ required: true }) tracks: ListTrackDTO[] = [];

  showAllTracks: boolean = false;
  readonly defaultLimit: number = 5;

  get displayedTracks(): ListTrackDTO[] {
    if (this.showAllTracks || this.tracks.length <= this.defaultLimit) {
      return this.tracks;
    }
    return this.tracks.slice(0, this.defaultLimit);
  }

  get hasMoreTracks(): boolean {
    return this.tracks.length > this.defaultLimit;
  }

  get remainingCount(): number {
    return this.tracks.length - this.defaultLimit;
  }

  toggleShowAll() {
    this.showAllTracks = !this.showAllTracks;
  }

  onTrackClick(trackId: number) {
    this.router.navigate(['home/track-details', trackId]);
  }

  constructor(private router: Router) {
  }
}
