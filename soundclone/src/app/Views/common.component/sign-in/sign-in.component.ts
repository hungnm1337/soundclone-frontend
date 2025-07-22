import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { AuthService, LoginRequest, LoginResponse } from "../../../Services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [HeaderComponent, FormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  usernameError: string = '';
  passwordError: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  validateForm(): boolean {
    let isValid = true;

    // Reset error messages
    this.usernameError = '';
    this.passwordError = '';


    // Validate username
    if (!this.username || this.username.trim() === '') {
      this.usernameError = 'Username is required';
      isValid = false;
    }

    // Validate password
    if (!this.password || this.password.trim() === '') {
      this.passwordError = 'Password is required';
      isValid = false;
    } else if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters long';
      isValid = false;
    }
   return isValid;
  }

  onLogin() {

    if (this.validateForm()) {

      this.isLoading = true;

      const loginRequest: LoginRequest = {
        username: this.username,
        password: this.password
      };

      this.authService.login(loginRequest).subscribe({
        next: (response: LoginResponse) => {

          // Save authentication data to localStorage
          this.authService.saveAuthData(response);

          // Check if user is logged in
          if (this.authService.isLoggedIn()) {

            this.router.navigate(['/home']);
          }

          this.isLoading = false;
        },
        error: (error: any) => {
          this.isLoading = false;

          // Handle different error scenarios
          if (error.status === 401) {
            this.passwordError = 'Invalid username or password';
          } else if (error.status === 404) {
            this.usernameError = 'User not found';
          } else {
            this.usernameError = 'Login failed. Please try again.';
          }
        }
      });

    } else {

    }
  }

  onGoogleLogin() {
    console.log('Google login clicked');
    // Here you would implement Google OAuth authentication
    console.log('Redirecting to Google OAuth...');
  }
}
