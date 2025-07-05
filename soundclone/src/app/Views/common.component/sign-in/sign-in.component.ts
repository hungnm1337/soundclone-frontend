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

    console.log('Validating form...');
    console.log('Username value:', this.username);
    console.log('Password value:', this.password);

    // Validate username
    if (!this.username || this.username.trim() === '') {
      this.usernameError = 'Username is required';
      isValid = false;
      console.log('Username validation failed');
    }

    // Validate password
    if (!this.password || this.password.trim() === '') {
      this.passwordError = 'Password is required';
      isValid = false;
      console.log('Password validation failed - empty');
    } else if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters long';
      isValid = false;
      console.log('Password validation failed - too short');
    }

    console.log('Form validation result:', isValid);
    console.log('Username error:', this.usernameError);
    console.log('Password error:', this.passwordError);

    return isValid;
  }

  onLogin() {
    console.log('Login attempt:');
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    console.log('Remember me:', this.rememberMe);

    if (this.validateForm()) {
      console.log('Form is valid, proceeding with authentication...');

      this.isLoading = true;

      const loginRequest: LoginRequest = {
        username: this.username,
        password: this.password
      };

      this.authService.login(loginRequest).subscribe({
        next: (response: LoginResponse) => {
          console.log('Login successful:', response);

          // Save authentication data to localStorage
          this.authService.saveAuthData(response);

          // Check if user is logged in
          if (this.authService.isLoggedIn()) {
            console.log('User is now logged in');
            console.log('Current user name:', this.authService.getCurrentUserName());
            console.log('Current username:', this.authService.getCurrentUsername());
            console.log('Current role ID:', this.authService.getCurrentUserRoleId());

            // Navigate to home page
            this.router.navigate(['/home']);
          }

          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Login failed:', error);
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
      console.log('Form validation failed');
      console.log('Username error:', this.usernameError);
      console.log('Password error:', this.passwordError);
    }
  }

  onGoogleLogin() {
    console.log('Google login clicked');
    // Here you would implement Google OAuth authentication
    console.log('Redirecting to Google OAuth...');
  }
}
