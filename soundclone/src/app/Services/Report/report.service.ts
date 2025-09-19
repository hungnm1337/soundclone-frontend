import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';

export interface SystemReportDTO {
  systemReportId: number;
  userId: number;
  content: string;
  isReplied: boolean;
}

export interface SystemReportDetailDTO {
  systemReportId: number;
  userId: number;
  content: string;
  reportDate: string;
  replyContent: string;
  replyDate: string;
}

export interface ReplySystemReportDTO {
  systemReportId: number;
  replyContent: string;
}


@Injectable({
  providedIn: 'root'
})
export class ReportService {
private apiUrl = 'https://localhost:7124/api/Report';

  constructor(private http: HttpClient, private authService: AuthService) { }

  GetAllSystemReports() {
          const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authService.getToken()}`
        });
    return this.http.get<SystemReportDTO[]>(`${this.apiUrl}/report`, { headers });
  }

  GetSystemReportById(systemReportId: number) {
            const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authService.getToken()}`
        });
    return this.http.get<SystemReportDetailDTO>(`${this.apiUrl}/report/${systemReportId}`, { headers });
  }

  GetSystemReportByUserId(userId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get<SystemReportDTO[]>(`${this.apiUrl}/reportby/${userId}`, { headers });
  }

  CreateSystemReport(model: SystemReportDTO) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post<boolean>(`${this.apiUrl}/create`, model, { headers });
  }

  ReplySystemReport(model: ReplySystemReportDTO) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.patch<boolean>(`${this.apiUrl}/reply`, model, { headers });
  }

}
