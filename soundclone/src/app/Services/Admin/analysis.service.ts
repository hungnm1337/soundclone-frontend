import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { MonthlyCount, MonthlyAmount } from '../../interfaces/analysis.interface';


@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private apiUrl = 'https://localhost:7124/api/Analysis';

  constructor(private http: HttpClient, private authService: AuthService) { }

  public GetUserRegistrationCountByMonth(){
    const token = this.authService.getToken();
    return this.http.get<MonthlyCount[]>(`${this.apiUrl}/user-registration`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

  }
  public GetTrackUploadCountByMonth(){
    const token = this.authService.getToken();
    return this.http.get<MonthlyCount[]>(`${this.apiUrl}/track-upload`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  public GetTotalInvoiceAmountByMonth(){
    const token = this.authService.getToken();
    return this.http.get<MonthlyAmount[]>(`${this.apiUrl}/invoice-amount`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  public GetInvoiceCountByMonth(){
    const token = this.authService.getToken();
    return this.http.get<MonthlyCount[]>(`${this.apiUrl}/invoice-count`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
