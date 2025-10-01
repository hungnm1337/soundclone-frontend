import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ListPlaylistDTO } from '../../../interfaces/listdata.interface';

@Component({
  selector: 'app-list-playlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-playlist.component.html',
  styleUrl: './list-playlist.component.scss'
})
export class ListPlaylistComponent {
  @Input() playlists!: ListPlaylistDTO[];

  showAllPlaylists: boolean = false;
  readonly defaultLimit: number = 5;

  get displayedPlaylists(): ListPlaylistDTO[] {
    if (this.showAllPlaylists || this.playlists.length <= this.defaultLimit) {
      return this.playlists;
    }
    return this.playlists.slice(0, this.defaultLimit);
  }

  get hasMorePlaylists(): boolean {
    return this.playlists.length > this.defaultLimit;
  }

  get remainingCount(): number {
    return this.playlists.length - this.defaultLimit;
  }

  toggleShowAll() {
    this.showAllPlaylists = !this.showAllPlaylists;
  }

  changePlaylist(playlistId: number) {
    this.router.navigate(['home/playlist', playlistId]);
  }

  constructor(private router: Router) { }
}
