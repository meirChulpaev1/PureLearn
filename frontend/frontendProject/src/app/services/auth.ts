import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private url = 'http://127.0.0.1:8000/api/users/';
  constructor(private http: HttpClient) { }

  register(username: string, password: string, email: string): Observable<any> {
    return this.http.post(this.url + 'register/', {
      username: username,
      password: password,
      email: email
    });
  }
  login(username: string, password: string): Observable<any> {
    return this.http.post(this.url + 'login/', {
      username: username,
      password: password
    });
  }
  logout(): Observable<any> {
    return this.http.post(this.url + 'logout/', {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
      }),
      catchError((err) => {
        localStorage.removeItem('token');
        throw err;
      })
    );
  }
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
  getCurrentUser(): Observable<any> {
    return this.http.get(this.url + 'me/');
  }
}
