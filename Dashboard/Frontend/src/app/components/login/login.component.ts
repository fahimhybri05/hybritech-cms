import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@ui5/webcomponents-ngx';

@Component({
  selector: 'app-login',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule,InputComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: '',
  };
  validationMessage = {
    email: '',
    password: '',
  };
  errorMessage = '';
  successMessage = '';
  loading = false;
  isPasswordVisible = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  clearError(field: 'email' | 'password'): void {
    this.validationMessage[field] = '';
    this.errorMessage = '';
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onLogin(): void {
    this.validationMessage = { email: '', password: '' };
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.credentials.email) {
      this.validationMessage.email = 'Email is required';
      return;
    }
    if (!this.credentials.email.includes('@')) {
      this.validationMessage.email = 'Invalid email format';
      return;
    }
    if (!this.credentials.password) {
      this.validationMessage.password = 'Password is required';
      return;
    }
    this.loading = true;
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.successMessage = 'Login successful!';
        this.loading = false;
        this.router
          .navigate(['/home'])
          .catch((error) => {
            console.error('Navigation to dashboard failed:', error);
          });
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loading = false;
        this.errorMessage = error.error.message || 'Login failed';
        if (error.error.errors) {
          this.validationMessage.email = error.error.errors.email?.[0] || '';
          this.validationMessage.password =
            error.error.errors.password?.[0] || '';
        }
      },
    });
  }

  onLogout(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearToken();
        this.successMessage = 'Logged out successfully!';
        this.loading = false;
        this.router
          .navigate(['/login'])
          .catch((error) => {
            console.error('Navigation to login failed:', error);
          });
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.loading = false;
        this.errorMessage = error.error.message || 'Logout failed';
      },
    });
  }
}
