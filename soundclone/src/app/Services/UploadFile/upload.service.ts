import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface UploadResponse {
  url: string;
  publicId: string;
}
@Injectable({
  providedIn: 'root'
})

export class UploadService {

  private apiUrl = 'https://localhost:7124/api/Upload';

  constructor(private http: HttpClient) { }

  public uploadFile(file: File): Observable<UploadResponse> {
    const formData = new FormData();

    formData.append('file', file, file.name);
    return this.http.post<UploadResponse>(this.apiUrl, formData);
  }
}
