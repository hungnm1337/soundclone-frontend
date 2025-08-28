import { Component, Input } from '@angular/core';
import { ListPlaylistDTO } from '../../../Services/ListData/list-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-playlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-playlist.component.html',
  styleUrl: './list-playlist.component.scss'
})
export class ListPlaylistComponent {
  @Input() playlists!: ListPlaylistDTO[];

}
