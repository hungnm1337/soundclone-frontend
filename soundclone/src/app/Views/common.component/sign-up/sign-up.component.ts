import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { AuthService, SignUpRequest } from "../../../Services/auth.service";

interface SignUpData {
  name: string;
  email: string;
  dayOfBirth: string;
  phoneNumber: string;
  username: string;
  hashedPassword: string;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [HeaderComponent, FormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  // Form fields
  name: string = '';
  email: string = '';
  dayOfBirth: string = '';
  phoneNumber: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  agreeTerms: boolean = false;

  // Error messages
  nameError: string = '';
  emailError: string = '';
  dayOfBirthError: string = '';
  phoneNumberError: string = '';
  usernameError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  generalError: string = '';
  successMessage: string = '';
  errorDetails: string = ''; // For debugging

  // Loading state
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  validateForm(): boolean {
    let isValid = true;

    // Reset all error messages
    this.nameError = '';
    this.emailError = '';
    this.dayOfBirthError = '';
    this.phoneNumberError = '';
    this.usernameError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.generalError = '';
    this.errorDetails = '';

    console.log('Validating sign-up form...');

    // Validate name
    if (!this.name || this.name.trim() === '') {
      this.nameError = 'Full name is required';
      isValid = false;
    }

    // Validate email
    if (!this.email || this.email.trim() === '') {
      this.emailError = 'Email is required';
      isValid = false;
    } else if (!this.isValidEmail(this.email)) {
      this.emailError = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate date of birth
    if (!this.dayOfBirth) {
      this.dayOfBirthError = 'Date of birth is required';
      isValid = false;
    } else {
      const today = new Date();
      const birthDate = new Date(this.dayOfBirth);

      // Reset time to compare only dates
      today.setHours(0, 0, 0, 0);
      birthDate.setHours(0, 0, 0, 0);

      if (birthDate >= today) {
        this.dayOfBirthError = 'Date of birth must be before today';
        isValid = false;
      } else {
        // Check if age is reasonable (not more than 150 years old)
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age > 150) {
          this.dayOfBirthError = 'Please enter a valid date of birth';
          isValid = false;
        } else {
          this.dayOfBirthError = '';
        }
      }
    }

    // Validate phone number
    if (!this.phoneNumber || this.phoneNumber.trim() === '') {
      this.phoneNumberError = 'Phone number is required';
      isValid = false;
    }

    // Validate username
    if (!this.username || this.username.trim() === '') {
      this.usernameError = 'Username is required';
      isValid = false;
    } else if (this.username.length < 3) {
      this.usernameError = 'Username must be at least 3 characters long';
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

    // Validate confirm password
    if (!this.confirmPassword || this.confirmPassword.trim() === '') {
      this.confirmPasswordError = 'Please confirm your password';
      isValid = false;
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      isValid = false;
    }

    // Validate terms agreement
    if (!this.agreeTerms) {
      console.log('Terms and conditions must be agreed to');
      isValid = false;
    }

    console.log('Form validation result:', isValid);
    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSignUp() {
    console.log('Sign up attempt:');
    console.log('Name:', this.name);
    console.log('Email:', this.email);
    console.log('Date of Birth:', this.dayOfBirth);
    console.log('Phone Number:', this.phoneNumber);
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    console.log('Agree Terms:', this.agreeTerms);

    if (this.validateForm()) {
      console.log('Form is valid, proceeding with registration...');
      this.isLoading = true;
      this.generalError = '';
      this.successMessage = '';
      this.errorDetails = '';

      // Create the data object for API
      const signUpData: SignUpRequest = {
        name: this.name,
        email: this.email,
        dayOfBirth: this.dayOfBirth,
        phoneNumber: this.phoneNumber,
        username: this.username,
        hashedPassword: this.password // In real app, this should be hashed
      };

      console.log('Data to send to API:', signUpData);

            // Make the API call
      this.authService.signUp(signUpData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.isLoading = false;
          this.successMessage = 'Registration successful! Redirecting to login...';

          // Clear form
          this.clearForm();

          // Redirect to login after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          console.log('Error status:', error.status);
          console.log('Error message:', error.message);
          console.log('Error error:', error.error);
          this.isLoading = false;

          // Save detailed error information for debugging
          this.errorDetails = this.getErrorDetails(error);
          console.log('Detailed error information:', this.errorDetails);

          // Check if it's a successful response (status 200) but treated as error
          if (error.status === 200) {
            console.log('✅ Registration successful with status 200:', error);
            this.successMessage = 'Registration successful! Redirecting to login...';
            this.generalError = '';
            this.errorDetails = '';

            // Clear form
            this.clearForm();

            // Redirect to login after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
            return;
          }

          if (error.status === 400) {
            if (error.error && typeof error.error === 'string') {
              console.log('String error from API:', error.error);
              this.generalError = error.error;
            } else if (error.error && error.error.errors) {
              // Handle validation errors from server
              console.log('Validation errors from API:', error.error.errors);
              const errors = error.error.errors;
              if (errors.Email) {
                this.emailError = errors.Email[0];
              }
              if (errors.Username) {
                this.usernameError = errors.Username[0];
              }
              if (errors.PhoneNumber) {
                this.phoneNumberError = errors.PhoneNumber[0];
              }
            } else {
              console.log('Generic 400 error, error.error:', error.error);
              this.generalError = 'Registration failed. Please check your information and try again.';
            }
          } else {
            console.log('Non-400 error, status:', error.status, 'error:', error.error);
            this.generalError = 'An error occurred during registration. Please try again later.';
          }
        }
      });

    } else {
      console.log('Form validation failed');
      console.log('Name error:', this.nameError);
      console.log('Email error:', this.emailError);
      console.log('Date of birth error:', this.dayOfBirthError);
      console.log('Phone number error:', this.phoneNumberError);
      console.log('Username error:', this.usernameError);
      console.log('Password error:', this.passwordError);
      console.log('Confirm password error:', this.confirmPasswordError);
    }
  }

  clearForm(): void {
    this.name = '';
    this.email = '';
    this.dayOfBirth = '';
    this.phoneNumber = '';
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
    this.agreeTerms = false;
  }

  // Method to get detailed error information for debugging
  getErrorDetails(error: any): string {
    let details = '';

    if (error.status) {
      details += `Status: ${error.status}\n`;
    }

    if (error.message) {
      details += `Message: ${error.message}\n`;
    }

    if (error.error) {
      if (typeof error.error === 'string') {
        details += `Error: ${error.error}\n`;
      } else if (typeof error.error === 'object') {
        details += `Error: ${JSON.stringify(error.error, null, 2)}\n`;
      }
    }

    return details;
  }

  onGoogleSignUp() {
    console.log('Google sign up clicked');
    // Here you would implement Google OAuth registration
    console.log('Redirecting to Google OAuth for registration...');
  }

  // Method to test API and log all response details
  testApiResponse() {
    const testData: SignUpRequest = {
      name: 'Test User',
      email: 'test@example.com',
      dayOfBirth: '1990-01-01',
      phoneNumber: '1234567890',
      username: 'testuser',
      hashedPassword: 'password123'
    };

    console.log('Testing API with data:', testData);

    this.authService.signUp(testData).subscribe({
      next: (response) => {
        console.log('✅ API Success Response:', response);
      },
      error: (error) => {
        console.log('❌ API Error Response:');
        console.log('Status:', error.status);
        console.log('Status Text:', error.statusText);
        console.log('Message:', error.message);
        console.log('Error Object:', error.error);
        console.log('Full Error:', error);

        // Log headers if available
        if (error.headers) {
          console.log('Response Headers:', error.headers);
        }

        // Log URL if available
        if (error.url) {
          console.log('Request URL:', error.url);
        }
      }
    });
  }
}
