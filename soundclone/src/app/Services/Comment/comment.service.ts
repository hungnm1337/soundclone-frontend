import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommentDTO } from '../../interfaces/comment.interface';



@Injectable({
  providedIn: 'root'
})

export class CommentService {
private apiUrl = 'https://localhost:7124/api/Comment';

  constructor(private http: HttpClient, private authService: AuthService) { }


  public getCommentsByTrackId(trackId: number) {
    return this.http.get<CommentDTO[]>(`${this.apiUrl}/track/${trackId}`);
  }

  public addComment(comment: CommentDTO){
     const headers = new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.authService.getToken()}`
            });
    return this.http.post<CommentDTO>(`${this.apiUrl}`, comment, { headers });
  }
}
