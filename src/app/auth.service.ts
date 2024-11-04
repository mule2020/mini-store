import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private apiUrl = 'https://fakestoreapi.com';

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
  login(username: string, password: string) {
    this.http.post(`${this.apiUrl}/auth/login`, { username, password })
      .subscribe((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.loggedIn.next(true);
          this.router.navigate(['/dashboard']);
        } else {
          alert('Invalid credentials');
        }
      }, error => {
        alert('Invalid credentials');
      });
  }

  signup(user: any) {
    this.http.post(`${this.apiUrl}/users`, user)
      .pipe(
        map((response: any) => {
          if (!response || Object.keys(response).length === 0) {

            //response checking  as we cannot create a real data on their database
            return {
              id: 21,
              email: user.email,
              username: user.username,
              password: user.password,
              name: user.name,
              address: user.address,
              phone: user.phone
            };
          }
          return response;
        }),
        catchError(error => {
          let errorMessage = 'An unknown error occurred!';
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
          alert(errorMessage);
          return throwError(errorMessage);
        })
      )
      .subscribe((response: any) => {
        alert('Sign-up successful! Please log in.');
        this.router.navigate(['/login']);
      });
  }

  addProduct(product: any) {
    return this.http.post(`${this.apiUrl}/products`, product)
      .pipe(
        catchError(error => {
          let errorMessage = 'An unknown error occurred!';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
          alert(errorMessage);
          return throwError(errorMessage);
        })
      );
  }

  getAllUsers() {
    return this.http.get(`${this.apiUrl}/users`);
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/']);
  }
}
