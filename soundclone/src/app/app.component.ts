import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'soundclone';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Initialize login state when app starts
    this.authService.updateLoginState();
  }
}
