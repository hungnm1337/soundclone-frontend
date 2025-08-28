import { Component, Input } from '@angular/core';
import { ListPlaylistDTO } from '../../../Services/ListData/list-data.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-playlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-playlist.component.html',
  styleUrl: './list-playlist.component.scss'
})
export class ListPlaylistComponent {
changePlaylist(playlistId: number) {
    this.router.navigate(['home/playlist', playlistId]);
}
constructor(private router: Router) { }
  @Input() playlists!: ListPlaylistDTO[];

}
