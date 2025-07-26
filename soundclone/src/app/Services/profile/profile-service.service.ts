import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UploadService, UploadResponse } from '../UploadFile/upload.service';
import { AuthService } from '../auth.service';

export interface UserProfile {
   userId: number;
  name: string;
  email: string;
  dayOfBirth: string;
  phoneNumber: string;
  bio?: string;
  profilePictureUrl?: string;
  createAt: string;
  updateAt: string;
  username: string;
  hashedPassword: string;
  status: string;
  roleId: number;
}
 interface ChangeProfilePicture {
  userId: number;
  profilePictureUrl: string;

 }
@Injectable({
  providedIn: 'root'
})
export class ProfileServiceService {

  private apiUrl = 'https://localhost:7124/api/Profile';

  constructor(private http: HttpClient, private authService: AuthService, private uploadService: UploadService) { }

  public GetProfile(): Observable<UserProfile> {
    const userId = this.authService.getCurrentUserUserId();
    return this.http.get<UserProfile>(`${this.apiUrl}/user-information/${userId}`);
  }

  public changeProfilePicture(file: File): void {
    this.uploadService.uploadFile(file).pipe(
      tap((response: UploadResponse) => {
        const userId = this.authService.getCurrentUserUserId();
        const changeProfilePicture: ChangeProfilePicture = {
          userId: userId ?? 0,
          profilePictureUrl: response.url
        };
        return this.http.put<ChangeProfilePicture>(`${this.apiUrl}/update-avatar`, changeProfilePicture);
      })
    );
  }
}
