import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";

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

      // Create the data object for API
      const signUpData: SignUpData = {
        name: this.name,
        email: this.email,
        dayOfBirth: this.dayOfBirth,
        phoneNumber: this.phoneNumber,
        username: this.username,
        hashedPassword: this.password // In real app, this should be hashed
      };

      console.log('Data to send to API:', signUpData);

      // Here you would make the API call
      // this.authService.signUp(signUpData).subscribe(...)

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

  onGoogleSignUp() {
    console.log('Google sign up clicked');
    // Here you would implement Google OAuth registration
    console.log('Redirecting to Google OAuth for registration...');
  }
}
