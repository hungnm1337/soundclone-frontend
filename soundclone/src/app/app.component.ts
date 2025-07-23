import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './Services/auth.service';
import { PlayerComponent } from './Views/common.component/player/player.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PlayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'soundclone';
  isTrackDetailPage = false;

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(() => {
      this.isTrackDetailPage = this.router.url.includes('/track-details');
    });
  }

  ngOnInit() {
    // Initialize login state when app starts
    this.authService.updateLoginState();
    this.isTrackDetailPage = this.router.url.includes('/track-details');
  }
}
