
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { AuthService } from '@app/services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@ui5/webcomponents-ngx';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
    standalone: true,

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, InputComponent, FormsModule],

  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  };
  validationMessage = {
    email: '',
    password: ''
  };
  errorMessage = '';
  successMessage = '';
  loading = false;
  isPasswordVisible = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  clearError(field: string): void {
    // this.validationMessage = { email: '', password: '' };
    this.errorMessage = '';
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onLogin(): void {
    // Reset messages
    this.validationMessage = { email: '', password: '' };
    this.errorMessage = '';
    this.successMessage = '';

    // Basic validation
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
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error.message || 'Login failed';
        if (error.error.errors) {
          this.validationMessage.email = error.error.errors.email?.[0] || '';
          this.validationMessage.password = error.error.errors.password?.[0] || '';
        }
      }
    });
  }
}
