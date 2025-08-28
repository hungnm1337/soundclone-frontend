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
onTrackClick(trackId: number) {
    this.router.navigate(['home/track-details', trackId]);

}
  @Input({ required: true }) tracks: ListTrackDTO[] = [];

  constructor(private router: Router) {
   }

}
