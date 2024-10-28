import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, RouterLink } from '@angular/router';
import { routes } from './app/app.routes';
import { AuthService } from './app/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Task Manager</h1>
        <nav>
          @if (!isAuthenticated()) {
            <div class="auth-links">
              <a routerLink="/login" class="nav-link">Login</a>
              <a routerLink="/register" class="nav-link">Register</a>
            </div>
          } @else {
            <div class="nav-links">
              <a routerLink="/" class="nav-link">Dashboard</a>
              <a routerLink="/tasks" class="nav-link">Tasks</a>
              <button (click)="logout()" class="logout-button">Logout</button>
            </div>
          }
        </nav>
      </header>
      <main>
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f3f4f6;
    }
    .app-header {
      background-color: #1e40af;
      color: white;
      padding: 1rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .app-header h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .nav-links, .auth-links {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .nav-link {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    .logout-button {
      background: transparent;
      border: 1px solid white;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .logout-button:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class App {
  constructor(private authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes)
  ]
});