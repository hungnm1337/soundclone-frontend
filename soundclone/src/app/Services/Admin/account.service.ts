import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { AccountDTO, AccountListDTO, ChangeRoleDTO, RoleDTO } from '../../interfaces/account.interface';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'https://localhost:7124/api/AccountManage';



  constructor(private http: HttpClient, private authService: AuthService) { }

  public getAllAccounts(): Observable<AccountListDTO[]> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      return this.http.get<AccountListDTO[]>(`${this.apiUrl}/accounts`, { headers });
  }

  public getAccountById(userId: number): Observable<AccountDTO> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      return this.http.get<AccountDTO>(`${this.apiUrl}/detail/${userId}`, { headers });
  }

  public blockAccount(userId: number): Observable<boolean> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      return this.http.put<boolean>(`${this.apiUrl}/block/${userId}`, null, { headers });
  }

  public unblockAccount(userId: number): Observable<boolean> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.put<boolean>(`${this.apiUrl}/unblock/${userId}`, null, { headers });
  }

  public searchAccounts(query: string): Observable<AccountListDTO[]> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      return this.http.get<AccountListDTO[]>(`${this.apiUrl}/search?searchTerm=${query}`, { headers });
  }

  public getAllRoles(): Observable<RoleDTO[]> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      return this.http.get<RoleDTO[]>(this.apiUrl + '/roles', { headers });
  }

  public changeUserRole(data: ChangeRoleDTO): Observable<boolean> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      return this.http.patch<boolean>(this.apiUrl + '/change-role', data, { headers });
  }

}
