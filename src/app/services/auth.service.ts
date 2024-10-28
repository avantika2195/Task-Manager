import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, AuthResponse, LoginCredentials, RegisterData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor() {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // TODO: Replace with actual API call
    if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
      const response: AuthResponse = {
        user: {
          id: '1',
          email: credentials.email,
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        token: 'mock_jwt_token'
      };
      
      return of(response).pipe(
        delay(1000),
        tap(res => this.handleAuthResponse(res))
      );
    }
    
    return throwError(() => new Error('Invalid credentials'));
  }

  register(data: RegisterData): Observable<AuthResponse> {
    // TODO: Replace with actual API call
    const response: AuthResponse = {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      token: 'mock_jwt_token'
    };

    return of(response).pipe(
      delay(1000),
      tap(res => this.handleAuthResponse(res))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: 'ADMIN' | 'USER'): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}