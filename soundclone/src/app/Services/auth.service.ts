import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginRequest, LoginResponse, SignUpRequest, SignUpResponse, UserInfo } from '../interfaces/auth.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getUserId() {
    throw new Error('Method not implemented.');
  }
  private readonly API_URL = 'https://localhost:7124/api/Login/login';
  private readonly SIGNUP_API_URL = 'https://localhost:7124/api/Register';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_INFO_KEY = 'user_info';
  private readonly EXPIRES_AT_KEY = 'expires_at';

  // BehaviorSubject to track login state changes
  private loginStateSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public loginState$ = this.loginStateSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.API_URL, loginRequest);
  }

  signUp(signUpRequest: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(this.SIGNUP_API_URL, signUpRequest);
  }

  // Save authentication data to localStorage
  saveAuthData(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(response.userInfo));
    localStorage.setItem(this.EXPIRES_AT_KEY, response.expiresAt);

    // Update login state
    this.loginStateSubject.next(true);
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get refresh token from localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Get user info from localStorage
  getUserInfo(): UserInfo | null {
    const userInfoStr = localStorage.getItem(this.USER_INFO_KEY);
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  }

  // Get expiration time from localStorage
  getExpiresAt(): string | null {
    return localStorage.getItem(this.EXPIRES_AT_KEY);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const token = this.getToken();
    const expiresAt = this.getExpiresAt();

    if (!token || !expiresAt) {
      return false;
    }

    // Check if token is expired
    const expirationDate = new Date(expiresAt);
    const currentDate = new Date();

    return currentDate < expirationDate;
  }

  // Logout - clear all authentication data
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
    localStorage.removeItem(this.EXPIRES_AT_KEY);

    console.log('User logged out, localStorage cleared');

    // Update login state
    this.loginStateSubject.next(false);
  }

  // Get current user's name
  getCurrentUserName(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.name : null;
  }

  // Get current user's username
  getCurrentUsername(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.username : null;
  }

  // Get current user's role ID
  getCurrentUserRoleId(): number | null {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.roleId : null;
  }

  getCurrentUserUserId(): number | null {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.id : null;
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) {
      return true;
    }

    const expirationDate = new Date(expiresAt);
    const currentDate = new Date();

    return currentDate >= expirationDate;
  }

  // Update login state (useful for initial load)
  updateLoginState(): void {
    this.loginStateSubject.next(this.isLoggedIn());
  }
}
