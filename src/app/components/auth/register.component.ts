import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterData } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Register</h2>
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              [(ngModel)]="userData.firstName"
              required
              #firstName="ngModel"
              class="form-control"
            >
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              [(ngModel)]="userData.lastName"
              required
              #lastName="ngModel"
              class="form-control"
            >
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="userData.email"
              required
              email
              #email="ngModel"
              class="form-control"
            >
            @if (email.invalid && (email.dirty || email.touched)) {
              <div class="error-message">
                Please enter a valid email address
              </div>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="userData.password"
              required
              minlength="6"
              #password="ngModel"
              class="form-control"
            >
            @if (password.invalid && (password.dirty || password.touched)) {
              <div class="error-message">
                Password must be at least 6 characters long
              </div>
            }
          </div>

          @if (error) {
            <div class="error-message">{{ error }}</div>
          }

          <button 
            type="submit" 
            [disabled]="registerForm.invalid || loading"
            class="submit-button"
          >
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 20px;
      background-color: #f3f4f6;
    }
    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      margin-top: 0.25rem;
    }
    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    .submit-button {
      width: 100%;
      padding: 0.75rem;
      background-color: #1e40af;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    .submit-button:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }
  `]
})
export class RegisterComponent {
  userData: RegisterData = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }
}