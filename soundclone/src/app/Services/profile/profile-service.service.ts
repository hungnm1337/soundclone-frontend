import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UploadService, UploadResponse } from '../UploadFile/upload.service';
import { AuthService } from '../auth.service';
import { UserProfile, ChangeProfilePicture, UserInformation } from '../../interfaces/profile.interface';



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

  public changeProfilePicture(fileURl: string): Observable<any> {

        const userId = this.authService.getCurrentUserUserId();
        const changeProfilePicture: ChangeProfilePicture = {
          userId: userId ?? 0,
          profilePictureUrl: fileURl
        };
        return this.http.put<ChangeProfilePicture>(`${this.apiUrl}/update-avatar`, changeProfilePicture);
  }

  public updateUserInformation(userInfo: UserInformation): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/update-profile`, userInfo);
  }


}
