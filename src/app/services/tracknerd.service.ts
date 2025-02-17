import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TracknerdService {
  private BASE_URL = environment.tracknerdApiUrl;
  private USERNAME = environment.tracknerdUsername;
  private PASSWORD = environment.tracknerdPassword;

  private authUrl = this.BASE_URL + '/auth/login';
  private liveDataUrl =  this.BASE_URL +'/dashboard/fleet-status';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    // Check if the token is already stored in localStorage
    this.token = localStorage.getItem('tracknerdToken');
  }

  private storeToken(token: string) {
    this.token = token;
    localStorage.setItem('tracknerdToken', token);
  }

  private clearToken() {
    this.token = null;
    localStorage.removeItem('tracknerdToken');
  }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };

    return this.http.post<any>(this.authUrl, body)
      .pipe(
        map(response => {
          if (response && response.token) {
            this.storeToken(response.token); // assuming the token is in the response object
          }
          return response;
        }),
        catchError(error => {
          this.clearToken();
          return throwError(error);
        })
      );
  }

  private ensureAuthenticated(): Observable<string> {
    if (this.token) {
      // If token is available, return it as an observable
      return of(this.token);
    } else {
      // If token is not available, perform login
      return this.login(this.USERNAME,this.PASSWORD).pipe(
        map(response => response.token),
        catchError(error => throwError('Login failed'))
      );
    }
  }

  getLiveData(): Observable<any> {
    return this.ensureAuthenticated().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any>(this.liveDataUrl, { headers }).pipe(
          catchError(error => {
            // Handle unauthorized errors by clearing the token
            if (error.status === 401) {
              this.clearToken();
            }
            return throwError(error);
          })
        );
      })
    );
  }
}
